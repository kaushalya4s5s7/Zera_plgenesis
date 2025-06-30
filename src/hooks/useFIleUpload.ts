// src/hooks/useFileUpload.ts

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Synapse } from "@filoz/synapse-sdk";
import { useEthersSigner } from "./useEthers";
import { useConfetti } from "./useConfetti";
import { useAccount } from "wagmi";
import { useNetwork } from "./useNetwork";
import { preflightCheck } from "@/utils/preFlightCheck";
import { getProofset } from "@/utils/getProofset";
import { config } from "@/config";

export type UploadedInfo = {
  fileName?: string;
  fileSize?: number;
  commp?: string;
  txHash?: string;
};

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploadedInfo, setUploadedInfo] = useState<UploadedInfo | null>(null);

  const signer = useEthersSigner();
  const { triggerConfetti } = useConfetti();
  const { address, chainId } = useAccount();
  const { data: network, isLoading: isNetworkLoading, isError: isNetworkError, error: networkError } = useNetwork();

  const canUpload = !!signer && !!address && !!chainId && !isNetworkLoading && !!network && !isNetworkError;

  const mutation: any = useMutation<any, Error, any>({
    mutationKey: ["file-upload", address, chainId],
    mutationFn: async (file: File) => {
      if (!signer) throw new Error("Upload failed: Wallet not connected or signer unavailable.");
      if (!address) throw new Error("Upload failed: Wallet address not found.");
      if (!chainId) throw new Error("Upload failed: Chain ID not found.");
      if (!network) throw new Error(`Upload failed: Network not found or unsupported. Error: ${networkError?.message || 'Unknown'}`);

      setProgress(0);
      setUploadedInfo(null);
      setStatus("🔄 Initializing file upload to Filecoin...");

      const arrayBuffer = await file.arrayBuffer();
      const uint8ArrayBytes = new Uint8Array(arrayBuffer);

      const synapse = await Synapse.create({
        provider: signer.provider as any,
        disableNonceManager: false,
        withCDN: config.withCDN,
      });

      const { providerId } = await getProofset(signer, network, address);
      console.log(providerId);
      const numericProviderId = providerId ? Number(providerId) : undefined;
      const withProofset = !!numericProviderId;

      setStatus("💰 Checking USDFC balance and storage allowances...");
      setProgress(5);

      await preflightCheck(
        file,
        synapse,
        network,
        withProofset,
        setStatus,
        setProgress
      );

      setStatus("🔗 Setting up storage service and proof set...");
      setProgress(25);

      const storageService = await synapse.createStorage({
        providerId: numericProviderId,
        callbacks: {
          onProofSetResolved: () => {
            setStatus("🔗 Existing proof set found and resolved");
            setProgress(30);
          },
          onProofSetCreationStarted: () => {
            setStatus("🏗️ Creating new proof set on blockchain...");
            setProgress(35);
          },
          onProofSetCreationProgress: (status) => {
            if (status.transactionSuccess) {
              setStatus(`⛓️ Proof set transaction confirmed on chain`);
              setProgress(45);
            }
            if (status.serverConfirmed) {
              setStatus(`🎉 Proof set ready! (${Math.round(status.elapsedMs / 1000)}s)`);
              setProgress(50);
            }
          },
         onProviderSelected: (rawProvider: any) => {
    // Normalize provider fields
    const normalized = {
      id: rawProvider?.id || rawProvider?.providerId || rawProvider?.owner || rawProvider?.clientId || undefined, // Added clientId as another potential fallback
      endpoint: rawProvider?.endpoint || rawProvider?.url || rawProvider?.pdpUrl || rawProvider?.pieceRetrievalUrl || undefined,
      name: rawProvider?.name || rawProvider?.title || rawProvider?.owner?.slice(0, 10) || "Unnamed Provider",
      raw: rawProvider
    };

    setStatus(`🏪 Storage provider selected: ${normalized.name}`);
    console.log("✅ Normalized Provider:", normalized);

    validateProviderReadiness(normalized, signer, address, chainId, network);
},
        },
      });

      // Validate provider connection and metadata
      async function validateProviderReadiness(provider: any, signer: any, address: any, chainId: any, network: any) {
        console.log("🔍 Starting provider readiness validation...");

        try {
          const providerEndpoint = provider?.endpoint;
          if (!providerEndpoint) {
            console.error("❌ PROVIDER ERROR: No endpoint configured", provider.raw);
            return;
          }

          try {
            const response = await fetch(providerEndpoint + "/health", {
              method: "GET",
              signal: AbortSignal.timeout(10000),
              headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
              console.error("❌ PROVIDER CONNECTIVITY ERROR:", {
                status: response.status,
                statusText: response.statusText,
                url: response.url
              });
            } else {
              console.log("✅ Provider connectivity confirmed");
            }
          } catch (e) {
            console.error("❌ NETWORK CONNECTIVITY ERROR:", e);
          }

         // Patch/fill missing fields
provider.id = provider.id ?? provider.providerId ?? provider.owner;  // fallback to owner address
provider.endpoint = provider.endpoint ?? provider.pdpUrl ?? provider.pieceRetrievalUrl;
provider.name = provider.name ?? "UnknownProvider"; // fallback value


          const requiredFields = ['id', 'endpoint', 'name'];
          const missingFields = requiredFields.filter(field => !provider[field]);
          if (missingFields.length > 0) {
            console.error("❌ PROVIDER CONFIGURATION ERROR: Missing fields:", missingFields);
          } else {
            console.log("✅ Provider configuration validated");
          }

        } catch (error) {
          console.error("❌ PROVIDER VALIDATION FAILED:", error);
          throw error;
        }
      }

      setStatus("📁 Uploading file to storage provider...");
      setProgress(55);

      try {
        const { commp } = await storageService.upload(uint8ArrayBytes, {
          onUploadComplete: (commp) => {
            setStatus("📊 File uploaded! Signing msg to add roots to the proof set");
            setUploadedInfo({
              fileName: file.name,
              fileSize: file.size,
              commp: commp.toString(),
            });
            setProgress(80);
          },
          onRootAdded: async (tx) => {
            setStatus("🔄 Waiting for transaction confirmation...");
            if (tx) {
              try {
                const receipt = await tx.wait();
                console.log("✅ Transaction receipt:", receipt);
                setUploadedInfo((prev) => ({
                  ...prev,
                  txHash: tx.hash,
                }));
              } catch (err) {
                console.error("❌ TRANSACTION ERROR:", err);
              }
            }
            setProgress(85);
          },
          onRootConfirmed: (rootIds) => {
            setStatus("🌳 Data roots added to proof set successfully");
            setProgress(90);
            console.log("✅ Roots confirmed:", rootIds);
          },
        });

        if (!uploadedInfo?.txHash) {
          await new Promise((res) => setTimeout(res, 50000));
        }

        setProgress(95);
        setUploadedInfo((prev) => ({
          ...prev,
          fileName: file.name,
          fileSize: file.size,
          commp: commp.toString(),
        }));
      } catch (uploadError) {
        const error = uploadError as Error;
        console.error("❌ UPLOAD ERROR:", error.message);
        throw new Error("Upload failed. Please try again.");
      }

      console.log("🎉 UPLOAD SUCCESS:", {
        fileName: file.name,
        fileSize: file.size,
        commp: uploadedInfo?.commp,
        txHash: uploadedInfo?.txHash,
      });

      setStatus("🎉 File successfully stored on Filecoin!");
      setProgress(100);
      triggerConfetti();
    },
  });

  const handleReset = () => {
    setProgress(0);
    setUploadedInfo(null);
    setStatus("");
    mutation.reset();
  };

  return {
    uploadFileMutation: mutation,
    progress,
    uploadedInfo,
    handleReset,
    status,
    canUpload,
  };
};
