import * as dotenv from "dotenv";
import { decrypt, encrypt } from "eciesjs";
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

const privateKey = hexToBytes(process.env.PRIVATE_KEY ?? '0x'.slice(2));

console.log("privateKey: ", toHex(privateKey))

const publicKey = secp.getPublicKey(privateKey)

console.log("publicKey: ", toHex(publicKey))

const address = getAddress(publicKey);

console.log("address: ", address)

const applicationID = Buffer.from(process.env.APPLICATION_ID ?? '')

console.log('applicationID:', applicationID)

const applicationSecret = Buffer.from(process.env.APPLICATION_SECRET ?? '')

console.log("applicationSecret: ", applicationSecret)

const secretKey = Buffer.from(process.env.SECRET_KEY ?? '')

console.log("secretKey: ", secretKey)

const decryptedApplicationID = decrypt(privateKey, Buffer.from("04fab08cf72b5eac277e68f04b45e288d2ee68c4f1696e442e8c03ec7274c7d9da83c0dc614b840e518a4d4fd255a7ee8c9cdb04ceba84eea621ac41265c5a5ac80eacdfe3dd294d813774c1a1ccaedf95e967cbaf554b6c577555e4f64fbd265d4dbf5365c722956afe93d7ad66ca2a87090ddc38e504d6388e6a919b347d2655588e6a11231d2406ddce", "hex"))

console.log("decryptedApplicationID: ",  Buffer.from(decryptedApplicationID).toString())

const decryptedApplicationSecret = decrypt(privateKey, Buffer.from("04927edf4654b8f312250ff8fd6c03cc4fbfdcbfc2d5a27985942bf3921131fac7073d4e9ad43a5c679c3f172e487405aa149b04a6ed907bbbcd33ed2d60cb46720e027bdf21c27ec15469e5f63b1228a75fa641a55b5bcb3feb37dfa050fa987a14c27dca48b92eea19181c325e76d9d3f751018e8743c45fa66fea07f5f0151aab335a14fe29a7ecc2a28c01910fbe5f541ce1f3a1eb4625fbcd824a35503a4d002b", "hex"))

console.log("decryptedApplicationSecret: ",  Buffer.from(decryptedApplicationSecret).toString())

const decryptedSecretKey = decrypt(privateKey, Buffer.from("04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42", "hex"))

console.log("decryptedSecretKey: ",  Buffer.from(decryptedSecretKey).toString())
