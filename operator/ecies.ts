import * as dotenv from "dotenv";
import { encrypt } from "eciesjs";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import * as secp from "ethereum-cryptography/secp256k1.js";
import { hexToBytes, toHex } from "ethereum-cryptography/utils.js";

dotenv.config();

function getAddress(publicKey: Uint8Array) {
  const slicedPublicKey = publicKey.slice(1)
  const hash = keccak256(slicedPublicKey)
  return hash.slice(-20)
}

console.log(process.env)
console.log((process.env.PRIVATE_KEY ?? '0x').slice(2));

const privatekey = hexToBytes(process.env.PRIVATE_KEY ?? '0x'.slice(2));

console.log("privateKey: ", toHex(privatekey))

const publicKey = secp.getPublicKey(privatekey)

console.log("publicKey: ", toHex(publicKey))

const address = getAddress(publicKey);

console.log("address: ", address)

const applicationID = Buffer.from(process.env.APPLICATION_ID ?? '')

console.log('applicationID:', applicationID)

const applicationSecret = Buffer.from(process.env.APPLICATION_SECRET ?? '')

console.log("applicationSecret: ", applicationSecret)

const secretKey = Buffer.from(process.env.SECRET_KEY ?? '')

console.log("secretKey: ", secretKey)

const encryptedApplicationID = encrypt(publicKey, applicationID)

console.log("enryptedApplicationID: ", Buffer.from(encryptedApplicationID).toString('hex'))

const encryptedApplicationSecret = encrypt(publicKey, applicationSecret)

console.log("encryptedApplicationSecret: ", Buffer.from(encryptedApplicationSecret).toString('hex'))

const encryptedSecretKey = encrypt(publicKey, secretKey)

console.log("encryptedSecretKey: ", Buffer.from(encryptedSecretKey).toString('hex'))


// const privateKeyInHex = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// console.log("Private Key (Hex):", privateKeyInHex);


// const privateKeyInBytes = hexToBytes(privateKeyInHex);
// console.log("Private Key (Bytes):", privateKeyInBytes);


// const encryptedSecretKey = "045b90af840ef9a8197685d45187712bc3201347773f5d93ae38711e9b89e44ee1b9841507f64608756fdf55949e9cf604ea345ef2b5dd2441048d764910c85fb9474dc5f8ba03fca011082e5bc4b45d413cbf313a4985e642acab530c065baa442c857c324c6b5235ec1e7df7083d69434832f31ec76fbaad69a6441f56f0390b417f9f9f6bda0f64a06e";
// console.log("Encrypted URL Token:", encryptedSecretKey);

// const decryptedSecretKey = decrypt(privateKeyInBytes, Buffer.from(encryptedSecretKey, "hex"));
// console.log("Decrypted URL Token:", Buffer.from(decryptedSecretKey).toString());
