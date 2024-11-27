import * as dotenv from "dotenv";
import { PinataSDK } from "pinata-web3";

dotenv.config();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY,
});

console.log({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: process.env.PINATA_GATEWAY,
  })

async function main() {
  try {
    const file = new File([JSON.stringify({"test": "test"})], "test.json", { type: "application/json" });
    const upload = await pinata.upload.file(file);
    console.log(upload);
  } catch (error) {
    console.log(error);
  }
}

main();
