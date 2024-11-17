import { ethers } from "ethers";
import * as dotenv from "dotenv";
const fs = require('fs');
const path = require('path');
dotenv.config();

// Check if the process.env object is empty
if (!Object.keys(process.env).length) {
    throw new Error("process.env object is empty");
}

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
/// TODO: Hack
let chainId = 31337;

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

// Initialize contract objects from ABIs
const delegationManager = new ethers.Contract(delegationManagerAddress, delegationManagerABI, wallet);
const insuranceServiceManager = new ethers.Contract(insuranceServiceManagerAddress, insuranceServiceManagerABI, wallet);
const ecdsaRegistryContract = new ethers.Contract(ecdsaStakeRegistryAddress, ecdsaRegistryABI, wallet);
const avsDirectory = new ethers.Contract(avsDirectoryAddress, avsDirectoryABI, wallet);

const signAndRespondToClaim = async (claimIndex: number, claimCreatedBlock: number, pool: string, insured: string) => {
    try {
        const message = `Insurance, ${claimIndex}`;
        const messageHash = ethers.solidityPackedKeccak256(["string"], [message]);
        const messageBytes = ethers.getBytes(messageHash);
        const signature = await wallet.signMessage(messageBytes);

        console.log(`Signing and responding to claim ${claimIndex}`);

        const operators = [await wallet.getAddress()];
        const signatures = [signature];
        const signedClaim = ethers.AbiCoder.defaultAbiCoder().encode(
            ["address[]", "bytes[]", "uint32"],
            [operators, signatures, ethers.toBigInt(await provider.getBlockNumber() - 1)]
        );

        let isApproved = false;

        if (Math.random() * 10 % 2 == 0) {
            isApproved = true;
        } else {
            isApproved = false;
        }

        const tx = await insuranceServiceManager.respondToClaim(
            { pool: pool, insured: insured, isApproved: isApproved, claimCreatedBlock: claimCreatedBlock },
            claimIndex,
            signedClaim
        );
        await tx.wait();
        console.log(`Responded to claim.`);
    } catch (e) {
        console.log('error', e)
    }
};

const registerOperator = async () => {
    // Registers as an Operator in EigenLayer.
    try {
        const tx1 = await delegationManager.registerAsOperator({
            __deprecated_earningsReceiver: await wallet.address,
            delegationApprover: "0x0000000000000000000000000000000000000000",
            stakerOptOutWindowBlocks: 0
        }, "");
        await tx1.wait();
        console.log("Operator registered to Core EigenLayer contracts");
    } catch (error) {
        console.error("Error in registering as operator:", error);
    }

    const salt = ethers.hexlify(ethers.randomBytes(32));
    const expiry = Math.floor(Date.now() / 1000) + 3600; // Example expiry, 1 hour from now

    // Define the output structure
    let operatorSignatureWithSaltAndExpiry = {
        signature: "",
        salt: salt,
        expiry: expiry
    };

    // Calculate the digest hash, which is a unique value representing the operator, avs, unique value (salt) and expiration date.
    const operatorDigestHash = await avsDirectory.calculateOperatorAVSRegistrationDigestHash(
        wallet.address,
        await insuranceServiceManager.getAddress(),
        salt,
        expiry
    );
    console.log(operatorDigestHash);

    // Sign the digest hash with the operator's private key
    console.log("Signing digest hash with operator's private key");
    const operatorSigningKey = new ethers.SigningKey(process.env.PRIVATE_KEY!);
    const operatorSignedDigestHash = operatorSigningKey.sign(operatorDigestHash);

    // Encode the signature in the required format
    operatorSignatureWithSaltAndExpiry.signature = ethers.Signature.from(operatorSignedDigestHash).serialized;

    console.log("Registering Operator to AVS Registry contract");


    // Register Operator to AVS
    // Per release here: https://github.com/Layr-Labs/eigenlayer-middleware/blob/v0.2.1-mainnet-rewards/src/unaudited/ECDSAStakeRegistry.sol#L49
    const tx2 = await ecdsaRegistryContract.registerOperatorWithSignature(
        operatorSignatureWithSaltAndExpiry,
        wallet.address
    );
    await tx2.wait();
    console.log("Operator registered on AVS successfully");
};

const monitorNewClaims = async () => {
    //console.log(`Creating new claim "EigenWorld"`);
    //await insuranceServiceManager.createNewClaim("EigenWorld");

    insuranceServiceManager.on("NewClaimCreated", async (claimIndex: number, claim: any) => {
        console.log(`New claim detected: Insurance, ${claim.pool} ${claim.insured}`);
        await signAndRespondToClaim(claimIndex, claim.claimCreatedBlock, claim.pool, claim.insured);
    });

    console.log("Monitoring for new claims...");
};

const main = async () => {
    await registerOperator();
    monitorNewClaims().catch((error) => {
        console.error("Error monitoring claims:", error);
    });
};

main().catch((error) => {
    console.error("Error in main function:", error);
});