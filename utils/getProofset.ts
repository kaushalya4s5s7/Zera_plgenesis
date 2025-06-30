// src/utils/getProofset.ts

import { CONTRACT_ADDRESSES, PandoraService } from "@filoz/synapse-sdk";
import { JsonRpcSigner } from "ethers";
import { config } from "@/config";

export const getProofset = async (
  signer: JsonRpcSigner,
  network: "mainnet" | "calibration",
  address: string
) => {
  const pandoraService = new PandoraService(
    signer.provider as any,
    CONTRACT_ADDRESSES.PANDORA_SERVICE[network]
  );
  let providerId: string | null = null; // Keep this explicit type declaration, initialized to null

  let bestProofset = null; // Initialize to null

  try {
    const AllproofSets = await pandoraService.getClientProofSetsWithDetails(address);
    console.log("DEBUG: AllproofSets from getClientProofSetsWithDetails:", AllproofSets);

    const proofSetsWithCDN = AllproofSets.filter((proofSet) => proofSet.withCDN);
    const proofSetsWithoutCDN = AllproofSets.filter(
      (proofSet) => !proofSet.withCDN
    );

    const proofSets = config.withCDN ? proofSetsWithCDN : proofSetsWithoutCDN;
    console.log("DEBUG: Filtered proofSets (based on config.withCDN):", proofSets);

    if (proofSets.length > 0) {
      bestProofset = proofSets.reduce((max, proofSet) => {
        return proofSet.currentRootCount > max.currentRootCount ? proofSet : max;
      }, proofSets[0]);

      console.log("DEBUG: BestProofset found:", bestProofset);

      if (bestProofset) {
        // --- FOCUS HERE: SAFELY HANDLE THE RETURN TYPE OF getProviderIdByAddress ---
        const retrievedProviderId = await pandoraService.getProviderIdByAddress(
          bestProofset.payee
        );

        console.log("DEBUG: Raw retrievedProviderId type:", typeof retrievedProviderId, "value:", retrievedProviderId);

        // Safely assign to providerId, ensuring it's a string or null
        if (typeof retrievedProviderId === 'string') {
          providerId = retrievedProviderId;
        } else if (typeof retrievedProviderId === 'number') {
          // This is highly unexpected for a blockchain address, but we'll convert as a fallback.
          console.warn("WARNING: getProviderIdByAddress returned a number. Converting to string.");
          providerId = String(retrievedProviderId); // Convert the number to a string
        } else if (retrievedProviderId === null || retrievedProviderId === undefined) {
          providerId = null; // Explicitly set to null if the value is null/undefined
        } else {
          // Log an error if an entirely unexpected type is returned
          console.error("ERROR: getProviderIdByAddress returned an unexpected type:", typeof retrievedProviderId, retrievedProviderId);
          providerId = null; // Default to null on unexpected type
        }
      }
    } else {
      console.log("DEBUG: No existing proofsets found for client address:", address);
      // providerId remains null, which is the correct signal for Synapse to potentially create a new one.
    }
  } catch (error) {
    console.error("Error in getProofset:", error);
    // If an error occurs, providerId remains null
  }
  return { providerId, proofset: bestProofset };
};