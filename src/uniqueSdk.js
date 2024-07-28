// src/uniqueSdk.js
import { Sdk, CHAIN_CONFIG } from '@unique-nft/sdk';
import { Sr25519Account } from '@unique-nft/sr25519';

// Load the mnemonic from the environment variables
const mnemonic = process.env.REACT_APP_MNEMONIC;

if (!mnemonic) {
  throw new Error("Mnemonic is not defined. Please set it in the .env file.");
}

const account = Sr25519Account.fromUri(mnemonic);

export const sdk = new Sdk({
  baseUrl: CHAIN_CONFIG.opal.restUrl,
  signer: account,
});