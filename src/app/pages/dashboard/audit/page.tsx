"use client";
import { Save } from "lucide-react";
// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useUser } from "@civic/auth-web3/react";
import { useAutoConnect } from "@civic/auth-web3/wagmi";
import { useState, useEffect } from "react";
import DashboardLayout from "@/src/components/dashboard/dashlayout/dashlayout";
import CodeAnalyzer from "@/src/components/dashboard/audit/codeAnalyzer";
import AuditResults from "@/src/components/dashboard/audit/auditResults";
import { useToast } from "@/src/hooks/use-toast";
import { useAccount, useWalletClient, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { analyzeContractSecurity } from "../../../../../utils/mistralAI";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import useAuditStore from "@/src/store/auditStore";


const AUDIT_REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "stars",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "summary",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "auditor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AuditRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "stars",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "summary",
        type: "string",
      },
    ],
    name: "registerAudit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "startIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getAllAudits",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "contractHashes",
        type: "bytes32[]",
      },
      {
        internalType: "uint8[]",
        name: "stars",
        type: "uint8[]",
      },
      {
        internalType: "string[]",
        name: "summaries",
        type: "string[]",
      },
      {
        internalType: "address[]",
        name: "auditors",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "timestamps",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "auditor",
        type: "address",
      },
    ],
    name: "getAuditorHistory",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
    ],
    name: "getContractAudits",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "stars",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "summary",
            type: "string",
          },
          {
            internalType: "address",
            name: "auditor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct AuditRegistry.AuditEntry[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getContractHashByIndex",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
    ],
    name: "getLatestAudit",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "stars",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "summary",
            type: "string",
          },
          {
            internalType: "address",
            name: "auditor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct AuditRegistry.AuditEntry",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalContracts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: string;
  source: string;
  line?: number | null;
  recommendation?: string;
}

const AUDIT_REGISTRY_ADDRESS = "0x49466ba632569a2d9f1919941468F17e287f26dA";

const parseIssuesFromAuditReport = (auditReport: string): AuditIssue[] => {
  const issues: AuditIssue[] = [];
  const lines = auditReport.split("\n");

  let currentIssue: Partial<AuditIssue> = {};

  lines.forEach((line) => {
    if (line.startsWith("####")) {
      if (currentIssue.id) {
        issues.push(currentIssue as AuditIssue);
      }
      
      const generateUUID = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          return crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      currentIssue = {
        id: generateUUID(),
        title: line.replace(/####/, "").trim(),
      };
    } else if (line.startsWith("- **Description**:")) {
      currentIssue.description = line.replace(/- \*\*Description\*\*:/, "").trim();
    } else if (line.startsWith("- **Affected Function**:")) {
      currentIssue.source = line.replace(/- \*\*Affected Function\*\*:/, "").trim();
    } else if (line.startsWith("- **Mitigation**:")) {
      currentIssue.recommendation = line.replace(/- \*\*Mitigation\*\*:/, "").trim();
    } else if (line.startsWith("- **Severity**:")) {
      currentIssue.severity = line.replace(/- \*\*Severity\*\*:/, "").trim().toLowerCase();
    }
  });

  if (currentIssue.id) {
    issues.push(currentIssue as AuditIssue);
  }

  return issues;
};

const AuditPage = () => {
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Use Civic Web3 Auth with auto-connect (following Web3Zone pattern)
  const { user, isLoading: isUserLoading, walletCreationInProgress } = useUser();
  useAutoConnect();
  
  // Wagmi hooks for wallet interaction (following Web3Zone pattern)
  const { isConnected, address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { toast } = useToast();
  const {
    auditScore,
    auditReport,
    contractHash,
    isLocked,
    issues,
    issueCount,
    setAuditScore,
    setAuditReport,
    setContractHash,
    setIssues,
    setIssueCount,
    setIsLocked,
  } = useAuditStore();

  // Use wagmi's useWriteContract hook for better transaction handling
  const { 
    writeContract, 
    data: hash, 
    error: writeError, 
    isPending: isWritePending 
  } = useWriteContract();

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Debug logging for user state (following Web3Zone pattern)
  useEffect(() => {
    console.log("Audit Page Debug Info:", {
      user,
      isUserLoading,
      walletCreationInProgress,
      isConnected,
      address,
      chain,
    });
  }, [user, isUserLoading, walletCreationInProgress, isConnected, address, chain]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Audit Registered",
        description: "The audit has been successfully registered on-chain!",
      });
      setIsLocked(false);
    }
  }, [isConfirmed, toast, setIsLocked]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      console.error("Write contract error:", writeError);
      toast({
        title: "Transaction Failed",
        description: `Failed to register the audit: ${writeError.message}`,
        variant: "destructive",
      });
    }
    if (confirmError) {
      console.error("Confirmation error:", confirmError);
      toast({
        title: "Confirmation Failed",
        description: `Transaction confirmation failed: ${confirmError.message}`,
        variant: "destructive",
      });
    }
  }, [writeError, confirmError, toast]);

  const convertAuditResultsToBuffer = async (data: any): Promise<Uint8Array> => {
  // 1. Convert data to a JSON string
  const jsonString = JSON.stringify(data, null, 2);

  // 2. Create a Blob
  const blob = new Blob([jsonString], { type: "application/json" });

  // 3. Convert Blob to ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();

  // 4. Convert ArrayBuffer to Uint8Array
  return new Uint8Array(arrayBuffer);
};




  const handleAnalyze = async (code: string, chain: string) => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter some code to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);





    try {
      const auditResults = await analyzeContractSecurity(code, chain);
      setAuditReport(auditResults);
          // const uint8Array = await convertAuditResultsToBuffer(auditResults);

      

      const generateUniqueHash = () => {
        const timestamp = Date.now().toString();
        const randomNum = Math.random().toString();
        const uniqueString = `${timestamp}-${randomNum}-${code.length}`;
        return keccak256(toUtf8Bytes(uniqueString));
      };

      const uniqueHash = generateUniqueHash();
      setContractHash(uniqueHash);

      const parsedIssues: AuditIssue[] = parseIssuesFromAuditReport(auditResults);
      setIssues(parsedIssues);

      const lowerReport = auditResults.toLowerCase();
      const critical = (lowerReport.match(/critical/g) || []).length;
      const high = (lowerReport.match(/high/g) || []).length;
      const medium = (lowerReport.match(/medium/g) || []).length;
      const low = (lowerReport.match(/low/g) || []).length;
      const info = (lowerReport.match(/info/g) || []).length;

      setIssueCount({ critical, high, medium, low, info });

      const totalIssues = critical * 5 + high * 3 + medium * 2 + low;
      const score = Math.max(100 - totalIssues * 2, 40);
      setAuditScore(score);

      setShowResults(true);
      setIsLocked(true);

      toast({
        title: "Audit Complete",
        description: `Audit completed with a score of ${score}%. Please register the audit on-chain to view details.`,
      });
    } catch (error) {
      console.error("Error analyzing contract:", error);
      toast({
        title: "Audit Failed",
        description: "An error occurred during the audit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegisterAudit = async () => {
    if (!contractHash || !auditReport) {
      toast({
        title: "Invalid Input",
        description: "Failed to register audit. Missing required data.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is loaded and authenticated (following Web3Zone pattern)
    if (isUserLoading || walletCreationInProgress) {
      toast({
        title: "Loading",
        description: "Please wait while we load your user information.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with Civic Auth to register audits.",
        variant: "destructive",
      });
      return;
    }

    // Check if wallet is connected (following Web3Zone pattern)
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please ensure your embedded wallet is connected. Try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Registering audit with:", {
        address,
        contractHash,
        auditScore,
        isConnected,
      });

      // Use wagmi's writeContract hook (similar to Web3Zone's sendTransaction pattern)
      

      try {
        writeContract({
        address: AUDIT_REGISTRY_ADDRESS as `0x${string}`,
        abi: AUDIT_REGISTRY_ABI,
        functionName: 'registerAudit',
        args: [contractHash, auditScore, "Audit completed successfully"],
      });
  // your transaction call
} catch (error: any) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    console.error("Error data:", error.data);
  } else {
    console.error("Generic error:", error);
  }
}


      toast({
        title: "Transaction Submitted",
        description: "Your audit registration transaction has been submitted. Waiting for confirmation...",
      });

    } catch (error: any) {
      console.error("Error registering audit:", error);
      toast({
        title: "Error",
        description: `Failed to register the audit: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Show loading state while user is being loaded (following Web3Zone pattern)
  if (isUserLoading || walletCreationInProgress) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">
            {walletCreationInProgress ? "Creating wallet..." : "Loading user information..."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show sign-in prompt if user is not authenticated (following Web3Zone pattern)
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Authentication Required
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please sign in using the button above to access audit features and register audits on-chain.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Security Audit</h2>
        <p className="text-gray-300">
          Analyze your smart contracts for vulnerabilities and security issues.
        </p>
        
       </div>
      <CodeAnalyzer onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      {showResults && (
        <div>
          {/* Lock Screen */}
          {isLocked && (
            <div className="bg-black/80 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Audit Results Locked
              </h3>
              <p className="text-gray-300 mb-6">
                To unlock the audit results, please register the audit on-chain.
              </p>

              {!isConnected && (
                <p className="text-yellow-400 mb-4">
                  Your embedded wallet is being initialized. Please wait...
                </p>
              )}

              <button
                onClick={handleRegisterAudit}
                disabled={isWritePending || isConfirming || !isConnected}
                className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mx-auto"
              >
                {isWritePending ? (
                  <>
                    <span className="animate-spin">↻</span>
                    <span>Submitting...</span>
                  </>
                ) : isConfirming ? (
                  <>
                    <span className="animate-spin">↻</span>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <span>Register Audit</span>
                )}
              </button>

              {hash && (
                <div className="mt-4 text-sm text-gray-400">
                  <p>Transaction Hash: {hash}</p>
                </div>
              )}
            </div>
          )}

          {/* Audit Results */}
          {!isLocked && <AuditResults/> }
        </div>
      )}
    </DashboardLayout>
  );
};

export default AuditPage;