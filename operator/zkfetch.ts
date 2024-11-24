import * as Reclaim from "@reclaimprotocol/js-sdk";
import { ReclaimClient } from '@reclaimprotocol/zk-fetch';
import * as dotenv from "dotenv";
import { decrypt } from "eciesjs";
import { hexToBytes } from "ethereum-cryptography/utils.js";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import * as curlConverter from 'curlconverter'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

// Check if the process.env object is empty
if (!Object.keys(process.env).length) {
    throw new Error("process.env object is empty");
}

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
/// TODO: Hack
let chainId = 421614;

const avsDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/insurance/${chainId}.json`), 'utf8'));
// Load core deployment data
const coreDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/core/${chainId}.json`), 'utf8'));

const delegationManagerAddress = coreDeploymentData.addresses.delegation; // todo: reminder to fix the naming of this contract in the deployment file, change to delegationManager
const avsDirectoryAddress = coreDeploymentData.addresses.avsDirectory;
const insuranceServiceManagerAddress = avsDeploymentData.addresses.insuranceServiceManager;
const ecdsaStakeRegistryAddress = avsDeploymentData.addresses.stakeRegistry;

// Load ABIs
const delegationManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/IDelegationManager.json'), 'utf8'));
const ecdsaRegistryABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/ECDSAStakeRegistry.json'), 'utf8'));
const insuranceServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/InsuranceServiceManager.json'), 'utf8'));
const avsDirectoryABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/IAVSDirectory.json'), 'utf8'));
const insurancePoolABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/IInsurancePool.json'), 'utf8'));

// Initialize contract objects from ABIs
const delegationManager = new ethers.Contract(delegationManagerAddress, delegationManagerABI, wallet);
const insuranceServiceManager = new ethers.Contract(insuranceServiceManagerAddress, insuranceServiceManagerABI, wallet);
const ecdsaRegistryContract = new ethers.Contract(ecdsaStakeRegistryAddress, ecdsaRegistryABI, wallet);
const avsDirectory = new ethers.Contract(avsDirectoryAddress, avsDirectoryABI, wallet);

const main = async () => {
    try {
        // Private key and derived bytes
        const privateKeyInHex = '0x45d37ea082249aa1349f24663fbcfdc325b4bce530527e929c4356fc925f4f47';

        const privateKeyInBytes = hexToBytes(privateKeyInHex);

        // Insurance pool variables
        // const url = await insurancePool.url();

        // const encryptedCurlSecretKey = await insurancePool.encryptedCurlSecretKey();
        // const regexExtraction = await insurancePool.regexExtraction();
        // const encryptedApplicationID = await insurancePool.encryptedApplicationID();
        // const encryptedApplicationSecret = await insurancePool.encryptedApplicationSecret();
        // const regexValidation = await insurancePool.regexValidation();
        // const approvedValue = await insurancePool.approvedValue();

        const curl = "curl --location --globoff 'https://api.npoint.io/c9aa3e8003aceb1b9b52' --header 'content-type: application/json' --header 'x-api-key: SECRET_KEY'"
        const encryptedCurlSecretKey = "04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42";
        const regexExtraction = '\\{"data":\\{"rekts":\\[(?<extractedValue>.*?)\\]\\}\\}';
        const encryptedApplicationID = "04fab08cf72b5eac277e68f04b45e288d2ee68c4f1696e442e8c03ec7274c7d9da83c0dc614b840e518a4d4fd255a7ee8c9cdb04ceba84eea621ac41265c5a5ac80eacdfe3dd294d813774c1a1ccaedf95e967cbaf554b6c577555e4f64fbd265d4dbf5365c722956afe93d7ad66ca2a87090ddc38e504d6388e6a919b347d2655588e6a11231d2406ddce";
        const encryptedApplicationSecret = "04927edf4654b8f312250ff8fd6c03cc4fbfdcbfc2d5a27985942bf3921131fac7073d4e9ad43a5c679c3f172e487405aa149b04a6ed907bbbcd33ed2d60cb46720e027bdf21c27ec15469e5f63b1228a75fa641a55b5bcb3feb37dfa050fa987a14c27dca48b92eea19181c325e76d9d3f751018e8743c45fa66fea07f5f0151aab335a14fe29a7ecc2a28c01910fbe5f541ce1f3a1eb4625fbcd824a35503a4d002b";
        const regexValidation = '"projectName":\\s*"Indodax"';

        // Decryption results
        const decryptedCurlSecretKey = Buffer.from(decrypt(privateKeyInBytes, Buffer.from(encryptedCurlSecretKey, "hex"))).toString();
        const decryptedApplicationID = Buffer.from(decrypt(privateKeyInBytes, Buffer.from(encryptedApplicationID, "hex"))).toString();
        const decryptedApplicationSecret = Buffer.from(decrypt(privateKeyInBytes, Buffer.from(encryptedApplicationSecret, "hex"))).toString();

        const result = curlConverter.toJsonString(curl.replace("SECRET_KEY", decryptedCurlSecretKey));
        const resultInJson = JSON.parse(result);

        console.log(curl);
        console.log(resultInJson.url);
        console.log(resultInJson);

        let isApproved = false;

        try {
            const reclaimClient = new ReclaimClient(decryptedApplicationID, decryptedApplicationSecret);

            const proof = await reclaimClient.zkFetch(resultInJson.url, {
                method: 'GET',
                headers: resultInJson.headers
            }, {
                responseMatches: [
                    {
                        "type": "regex",
                        "value": regexExtraction
                    }
                ],
            });

            console.log('proof', proof)

            if (!proof) {
                isApproved = false;
            } else {
                const isValid = await Reclaim.verifyProof(proof);
                if (!isValid) {
                    isApproved = false;
                    return;
                }

                const proofData = await Reclaim.transformForOnchain(proof);

                const regex = new RegExp(regexValidation);

                console.log('proof data', proofData);
                console.log('extracted value', proof.extractedParameterValues['extractedValue'])

                isApproved = regex.test(proof.extractedParameterValues['extractedValue']);
            }
        } catch (e) {
            console.log(e);
            isApproved = false;
        }

        console.log('operator', await wallet.getAddress());
        console.log('sevice manager', await insuranceServiceManager.getAddress());
        console.log(`Responded to claim, isApproved: ${isApproved}`);
    } catch (e) {
        console.log('error', e)
    }
};

main().catch((error) => {
    console.error("Error in main function:", error);
});