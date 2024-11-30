import * as Reclaim from "@reclaimprotocol/js-sdk";
import { ReclaimClient } from '@reclaimprotocol/zk-fetch';
import * as dotenv from "dotenv";
import { decrypt } from "eciesjs";
import { hexToBytes } from "ethereum-cryptography/utils.js";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import curlConverter from "@proxymanllc/better-curl-to-json";

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

        const curl = "curl -X GET 'https://api.npoint.io/c9aa3e8003aceb1b9b52' --header 'content-type: application/json' --header 'x-api-key: SECRET_KEY'"
        const encryptedCurlSecretKey = "04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42";
        const regexExtraction = '\\{"data":\\{"rekts":\\[(?<extractedValue>.*?)\\]\\}\\}';
        const encryptedApplicationID = "0496e329b071a7894b005740d8e4be15c42167f108ac0c0dbf94cd5ee893891c0e28df2f8be604ba129aaf6c758227a80af2a618769291fdd49ab895d0a3c5de546cdcc9b5e6743866d69bb30ca48ea6af2bf1e4a588e62d7a197953e3c1a4cc5115192085783ec4e7381b4fa250e0b64f80649e63375cac5b4d8675126d655e739d47e4ff989d877a9c4b";
        const encryptedApplicationSecret = "04283eb9915133830085f9dc05d364218551702a44c5264aac6d389297666268e7afcefd7b4570df7c6e9d249542c255a44b5399a4372c3542119aa728076a8cd0ee8c3a34c614f2ea1f6cb591ca36ea6b7712e74cc25079fe132cc65723e791aa";
        const regexValidation = '"projectName":\\s*"Indodax"';

        // Decryption results
        const decryptedCurlSecretKey = Buffer.from(decrypt(privateKeyInBytes, Buffer.from(encryptedCurlSecretKey, "hex"))).toString();
        const decryptedApplicationID = Buffer.from(decrypt(privateKeyInBytes, Buffer.from(encryptedApplicationID, "hex"))).toString();
        const decryptedApplicationSecret = Buffer.from(decrypt(privateKeyInBytes, Buffer.from(encryptedApplicationSecret, "hex"))).toString();

        const resultInJson = curlConverter(curl.replace("SECRET_KEY", decryptedCurlSecretKey));

        console.log(curl);
        console.log(resultInJson.url);
        console.log(resultInJson);

        let isApproved = false;

        try {
            const reclaimClient = new ReclaimClient(decryptedApplicationID, decryptedApplicationSecret);

            const proof = await reclaimClient.zkFetch(resultInJson.url, {
                method: 'GET',
                headers: resultInJson.header
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