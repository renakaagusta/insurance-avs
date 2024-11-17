import { ethers } from "ethers";
import * as dotenv from "dotenv";
const fs = require('fs');
const path = require('path');
dotenv.config();

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
/// TODO: Hack
let chainId = 31337;

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

async function createNewClaim(pool: string, insured: string) {
  try {
    // Send a transaction to the createNewClaim function
    const tx = await insuranceServiceManager.createNewClaim(pool, insured);

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
    const pool = generateRandomAddress();
    const insured = generateRandomAddress();
    console.log(`Creating new claim with pool: ${pool}, insured: ${insured}`);
    createNewClaim(pool, insured);
  }, 10000);
}

// Start the process
startCreatingClaims();