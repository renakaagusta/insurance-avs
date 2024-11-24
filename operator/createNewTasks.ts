import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_2!, provider);
/// TODO: Hack
let chainId = 1;

const avsDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/insurance/${chainId}.json`), 'utf8'));
const insuranceServiceManagerAddress = avsDeploymentData.addresses.insuranceServiceManager;
const insuranceServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/InsuranceServiceManager.json'), 'utf8'));
// Initialize contract objects from ABIs
const insuranceServiceManager = new ethers.Contract(insuranceServiceManagerAddress, insuranceServiceManagerABI, wallet);

function generateRandomAddress() {
  const hexChars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += hexChars[Math.floor(Math.random() * 16)];
  }
  return address;
}

async function createNewClaim(pool: string, insured: string, amount: number, index: number) {
  try {
    // Send a transaction to the createNewClaim function
    const tx = await insuranceServiceManager.createNewClaim(pool, insured, amount, index);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

// Function to create a new claim with a random name every 15 seconds
function startCreatingClaims() {
  setInterval(() => {
    // const pool = generateRandomAddress();
    // const insured = generateRandomAddress();
    // const amount = 1e6;
    const pool = "0x4de030b5f6b86a2b875953D919238e9AA3C2F506";
    const insured = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const amount = 40000000;
    const index = 0;
    console.log(`Creating new claim with pool: ${pool}, insured: ${insured}, amount: ${amount}`);
    createNewClaim(pool, insured, amount, index);
  }, 10000);
}

// Start the process
startCreatingClaims();