// @/utils/constant.ts

import { CONTRACT_ADDRESSES } from "@filoz/synapse-sdk";

export const getPandoraAddress = (network: "mainnet" | "calibration") => {
  return CONTRACT_ADDRESSES.PANDORA_SERVICE[network];
};

export const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

// CORRECTED: Define PROOF_SET_CREATION_FEE using a string for BigInt
// 0.1 * 10^18 is 100,000,000,000,000,000 (1 followed by 17 zeros)
export const PROOF_SET_CREATION_FEE = BigInt("100000000000000000"); // Represents 0.1 FIL/USDFC in 18 decimals