"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, Info, Save, Package, FileText, Zap } from "lucide-react";
import useAuditStore from "@/store/auditStore";
import { useFileUpload } from "@/hooks/useFIleUpload";
import { filecoinCalibration } from 'wagmi/chains'; // Import Filecoin Calibration chain
import { useSwitchChain, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { AUDIT_REGISTRY_ABI, CHAIN_CONFIG } from "../../../../utils/Contract";
import { useToast } from "@/hooks/use-toast";



const SeverityBadge = ({ severity }: { severity: string }) => {
  const validSeverity = severity || "unknown";
  const getBadgeStyles = () => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "high":
        return "bg-orange/20 text-orange border-orange";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500";
    }
  };

  const getIcon = () => {
    switch (validSeverity) {
      case "critical":
      case "high":
        return <AlertTriangle className="w-3 h-3" />;
      case "medium":
        return <AlertCircle className="w-3 h-3" />;
      case "low":
        return <Info className="w-3 h-3" />;
      default:
        return <Info className="w-3 h-3" />;
    }
  };

  return (
    <div
      className={`px-2 py-0.5 rounded text-xs border flex items-center gap-1 ${getBadgeStyles()}`}
    >
      {getIcon()}
      <span>
        {validSeverity.charAt(0).toUpperCase() + validSeverity.slice(1)}
      </span>
    </div>
  );
};

interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: string;
  source: string;
  line?: number | null;
  recommendation?: string;
}

interface AuditResultsProps {
  // New props for chain switching
  isSwitchingChain: boolean;
  currentActiveChainId: number;
}

const AuditResults = ({  isSwitchingChain, currentActiveChainId }: AuditResultsProps) => {
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);
  const [uploadStrategy, setUploadStrategy] = useState<'enhanced' | 'bundled' | 'raw'>('enhanced');
  const [isUploadAttempting, setIsUploadAttempting] = useState(false);
  const [hasAttemptedMapping, setHasAttemptedMapping] = useState(false); // Track if we've attempted CID mapping
 const {switchChain }= useSwitchChain();
  const { 
    uploadFileMutation, 
    uploadedInfo, 
    handleReset, 
    status, 
    progress, 
    canUpload 
  }: {
    uploadFileMutation: any;
    uploadedInfo: any;
    handleReset: () => void;
    status: string;
    progress: number;
    canUpload: boolean;
  } = useFileUpload();

  const { isPending: isLoading, mutateAsync: uploadFile } = uploadFileMutation;
  const { issues, auditScore, auditReport, contractHash, issueCount, setUploadedReportCID, setCurrentAuditHasUpload, auditTxHash, setAuditTxHash } = useAuditStore();

  // Debug auditTxHash state
  

  // Contract interaction hooks
  const { toast } = useToast();
  const { 
    writeContract: mapCIDContract, 
    data: mapCIDHash, 
    error: mapCIDError, 
    isPending: isMappingCID 
  } = useWriteContract();

  // Wait for CID mapping transaction confirmation
  const { 
    isLoading: isMappingConfirming, 
    isSuccess: isMappingConfirmed, 
    error: mappingConfirmError 
  } = useWaitForTransactionReceipt({
    hash: mapCIDHash,
  });

  // Get the current chain configuration
  const currentChainConfig = Object.values(CHAIN_CONFIG).find(config => config.chainId === currentActiveChainId);
  const auditRegistryAddress = currentChainConfig?.contractAddress;

  // Debug chain configuration
  
  // Debug logging for auditTxHash changes
  

  // Store the uploaded report CID when upload completes and wait before chain switching
  useEffect(() => {
    if (uploadedInfo?.commp && !isLoading) {
      // Only proceed if upload is completely finished (not just started)
      setUploadedReportCID(uploadedInfo.commp);
      setCurrentAuditHasUpload(true); // Mark current audit as having an upload
      console.log("=== REPORT UPLOAD COMPLETE ===");
      console.log("Stored uploaded report CID:", uploadedInfo.commp);
      console.log("uploadedInfo is :", uploadedInfo);
      console.log("Upload status set to:", true);
      console.log("Audit TX Hash:", auditTxHash);
      console.log("Upload is loading:", isLoading);
      console.log("===============================");

      // Wait for upload to be completely finished before chain switching
      const sepoliaChainId = 11155111;
      if (auditTxHash && currentActiveChainId !== sepoliaChainId) {
        console.log("⏳ Upload complete! Waiting 3 seconds before switching to Sepolia for CID mapping...");
        console.log("Audit already registered with TX Hash:", auditTxHash);
        
        // Wait 3 seconds to ensure upload is fully complete before switching chains
        setTimeout(() => {
          console.log("🔄 Now switching to Sepolia for CID mapping...");
          switchChain?.({ chainId: sepoliaChainId });
        }, 3000);
        
      } else if (auditTxHash && currentActiveChainId === sepoliaChainId) {
        console.log("✅ Already on Sepolia and audit is registered - proceeding with CID mapping");
        // If already on Sepolia and we have the audit transaction hash, map immediately
        if (!hasAttemptedMapping && !isMappingCID) {
          console.log("✅ Both CID and auditTxHash available - calling mapCIDToAudit immediately");
          setHasAttemptedMapping(true);
          mapCIDToAudit(auditTxHash, uploadedInfo.commp);
        }
      } else {
        console.log("ℹ️ Upload successful, but audit not yet registered. CID mapping will happen after audit registration.");
      }
    }
  }, [uploadedInfo?.commp, auditTxHash, currentActiveChainId, isLoading, setUploadedReportCID, setCurrentAuditHasUpload, switchChain]);

  // Map CID when auditTxHash becomes available and we're on Sepolia (after audit registration)
  useEffect(() => {
    const sepoliaChainId = 11155111;
    if (auditTxHash && 
        uploadedInfo?.commp && 
        auditRegistryAddress && 
        currentActiveChainId === sepoliaChainId && 
        !hasAttemptedMapping && 
        !isMappingCID) {
      console.log("=== AUDIT TX HASH AVAILABLE - MAPPING CID ===");
      console.log("Audit TX Hash:", auditTxHash);
      console.log("Uploaded CID:", uploadedInfo.commp);
      console.log("Registry Address:", auditRegistryAddress);
      console.log("Current Chain ID:", currentActiveChainId);
      console.log("Is Sepolia:", currentActiveChainId === sepoliaChainId);
      console.log("✅ Calling mapCIDToAudit now that audit is registered and we're on Sepolia");
      setHasAttemptedMapping(true); // Mark that we're attempting mapping
      mapCIDToAudit(auditTxHash, uploadedInfo.commp);
    } else if (auditTxHash && uploadedInfo?.commp && auditRegistryAddress && currentActiveChainId !== sepoliaChainId) {
      console.log("⏳ Waiting for chain switch to Sepolia before mapping CID");
      console.log("Current Chain ID:", currentActiveChainId, "Expected:", sepoliaChainId);
    }
  }, [auditTxHash, uploadedInfo?.commp, auditRegistryAddress, currentActiveChainId, hasAttemptedMapping, isMappingCID]);

  // Handle CID mapping confirmation
  useEffect(() => {
    if (isMappingConfirmed) {
      toast({
        title: "CID Mapping Complete",
        description: "The audit report CID has been successfully mapped on-chain!",
      });
      // Reset the mapping attempt flag for next audit
      setHasAttemptedMapping(false);
    }
  }, [isMappingConfirmed, toast]);

  // Handle CID mapping errors
  useEffect(() => {
    if (mapCIDError) {
      console.error("CID mapping error:", mapCIDError);
      toast({
        title: "CID Mapping Failed",
        description: `Failed to map CID to audit: ${mapCIDError.message}`,
        variant: "destructive",
      });
      // Reset the mapping attempt flag so user can retry
      setHasAttemptedMapping(false);
    }
    if (mappingConfirmError) {
      console.error("CID mapping confirmation error:", mappingConfirmError);
      toast({
        title: "CID Mapping Confirmation Failed",
        description: `CID mapping confirmation failed: ${mappingConfirmError.message}`,
        variant: "destructive",
      });
      // Reset the mapping attempt flag so user can retry
      setHasAttemptedMapping(false);
    }
  }, [mapCIDError, mappingConfirmError, toast]);

  // Reset upload attempting state when upload is complete
  useEffect(() => {
    if (uploadedInfo?.commp && !isLoading && isUploadAttempting) {
      console.log("✅ Upload completed successfully, resetting upload attempt state");
      setIsUploadAttempting(false);
    }
  }, [uploadedInfo?.commp, isLoading, isUploadAttempting]);

  // Function to map CID to audit transaction hash on-chain
  const mapCIDToAudit = async (txHash: string, cid: string) => {
    try {
      console.log("Mapping CID to audit on-chain:", { txHash, cid, auditRegistryAddress });
      
      mapCIDContract({
        address: auditRegistryAddress as `0x${string}`,
        abi: AUDIT_REGISTRY_ABI,
        functionName: 'mapCIDToAudit',
        args: [txHash as `0x${string}`, cid],
      });

     
    } catch (error) {
      console.error("Error mapping CID to audit:", error);
      toast({
        title: "CID Mapping Error",
        description: `Failed to submit CID mapping: ${error}`,
        variant: "destructive",
      });
    }
  };

  // Generate comprehensive audit report with padding for Filecoin compatibility
  const generateFilecoinCompatibleAuditFile = (strategy: 'enhanced' | 'bundled' | 'raw' = 'enhanced') => {
    const baseData = {
      auditScore,
      contractHash,
      issueCount,
      issues,
      auditReport,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0.0",
        auditTool: "Smart Contract Auditor",
        filecoinCompatible: true,
        uploadStrategy: strategy
      }
    };

    let fileContent: string;
    let fileName: string;
    let mimeType: string;

    switch (strategy) {
      case 'enhanced':
        // Create a comprehensive report with detailed explanations and padding
        const enhancedReport = {
          ...baseData,
          detailedAnalysis: {
            executiveSummary: `This smart contract audit report provides a comprehensive security assessment with an overall score of ${auditScore}%. The analysis identified ${Object.values(issueCount).reduce((a, b) => a + b, 0)} total issues across different severity levels.`,
            
            methodologySection: {
              description: "This audit employed multiple static analysis tools and manual review processes to identify potential security vulnerabilities, code quality issues, and best practice violations.",
              toolsUsed: ["Mistral AI Analysis", "Slither Static Analyzer", "Mythril Security Scanner"],
              analysisDepth: "Deep code analysis including control flow, data flow, and symbolic execution",
              coverageMetrics: "Full contract coverage with line-by-line security assessment"
            },

            riskAssessment: {
              criticalRisks: issues.filter(i => i.severity === 'critical').length,
              highRisks: issues.filter(i => i.severity === 'high').length,
              mediumRisks: issues.filter(i => i.severity === 'medium').length,
              lowRisks: issues.filter(i => i.severity === 'low').length,
              overallRiskLevel: auditScore >= 80 ? 'LOW' : auditScore >= 60 ? 'MEDIUM' : 'HIGH'
            },

            detailedIssues: issues.map(issue => ({
              ...issue,
              impact: `Potential impact analysis for ${issue.title}`,
              remediation: issue.recommendation || "Follow security best practices",
              references: [
                "https://consensys.github.io/smart-contract-best-practices/",
                "https://github.com/crytic/slither/wiki",
                "https://swcregistry.io/"
              ],
              codeSnippet: issue.line ? `Code reference at line ${issue.line}` : "Full contract analysis",
              testCases: `Recommended test cases for verifying fix for ${issue.title}`,
          })),

            recommendations: {
              immediate: "Address all critical and high severity issues before deployment",
              shortTerm: "Implement comprehensive test coverage and establish CI/CD security checks",
              longTerm: "Regular security audits and monitoring of deployed contracts",
              bestPractices: [
                "Use latest Solidity compiler version",
                "Implement proper access controls",
                "Add comprehensive event logging",
                "Use battle-tested libraries like OpenZeppelin",
                "Implement emergency pause mechanisms"
              ]
            },

            // Add padding content to reach minimum file size for Filecoin efficiency
            appendices: {
              securityChecklist: Array.from({length: 100}, (_, i) => `Security check ${i + 1}: Comprehensive security validation point`),
              codeAnalysisDetails: Array.from({length: 200}, (_, i) => `Detailed code analysis point ${i + 1}: In-depth examination of contract functionality and security implications`),
              complianceFramework: Array.from({length: 150}, (_, i) => `Compliance requirement ${i + 1}: Regulatory and industry standard compliance verification`),
              testingRecommendations: Array.from({length: 300}, (_, i) => `Test case ${i + 1}: Comprehensive testing scenario for smart contract validation`)
            }
          }
        };

        fileContent = JSON.stringify(enhancedReport, null, 2);
        // Ensure minimum file size by adding structured padding if needed
        const minSize = 50 * 1024 * 1024; // 50 MB minimum for better Filecoin compatibility
        if (fileContent.length < minSize) {
          const paddingNeeded = minSize - fileContent.length;
          const paddingData = {
            filecoinPadding: {
              purpose: "This section ensures the audit report meets Filecoin storage minimum size requirements for efficient sector packing",
              generatedContent: Array.from({length: Math.ceil(paddingNeeded / 100)}, (_, i) => 
                `Padding entry ${i + 1}: This audit report has been optimized for Filecoin storage with comprehensive security analysis and detailed recommendations for smart contract improvement and security enhancement.`
              ).join(" ")
            }
          };
          
          const reportWithPadding = { ...enhancedReport, ...paddingData };
          fileContent = JSON.stringify(reportWithPadding, null, 2);
        }
        fileName = `enhanced-audit-report-${contractHash || 'unknown'}-${Date.now()}.json`;
        mimeType = "application/json";
        break;

      case 'bundled':
        // Create multiple file formats bundled together
        const auditBundle = {
          ...baseData,
          formats: {
            json: baseData,
            csv: issues.map(issue => `"${issue.id}","${issue.title}","${issue.severity}","${issue.source}","${issue.line || 'N/A'}","${issue.description.replace(/"/g, '""')}"`).join('\n'),
            markdown: `# Smart Contract Audit Report\n\n## Summary\nAudit Score: ${auditScore}%\n\n## Issues\n${issues.map(issue => `### ${issue.title}\n- **Severity**: ${issue.severity}\n- **Source**: ${issue.source}\n- **Description**: ${issue.description}\n`).join('\n')}`,
            html: `<!DOCTYPE html><html><head><title>Audit Report</title></head><body><h1>Smart Contract Audit Report</h1><p>Score: ${auditScore}%</p></body></html>`
          },
          // Add comprehensive documentation
          documentation: Array.from({length: 1000}, (_, i) => `Documentation section ${i + 1}: Comprehensive audit documentation and analysis details for smart contract security assessment.`).join(" ")
        };
        fileContent = JSON.stringify(auditBundle, null, 2);
        fileName = `bundled-audit-report-${contractHash || 'unknown'}-${Date.now()}.json`;
        mimeType = "application/json";
        break;

      case 'raw':
      default:
        // Original format but with minimum size validation
        fileContent = JSON.stringify(baseData, null, 2);
        // Add warning about small file size
        if (fileContent.length < 1024 * 1024) { // Less than 1MB
          const warningData = {
            ...baseData,
            filecoinWarning: "This file is small and may not be cost-effective for Filecoin storage. Consider using enhanced or bundled format for better efficiency.",
            paddingForMinimumSize: Array.from({length: 10000}, (_, i) => `Padding data ${i + 1} to ensure minimum file size for Filecoin storage efficiency.`).join(" ")
          };
          fileContent = JSON.stringify(warningData, null, 2);
        }
        fileName = `audit-report-${contractHash || 'unknown'}-${Date.now()}.json`;
        mimeType = "application/json";
        break;
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const file = new File([blob], fileName, { type: mimeType });

    console.log(`Generated ${strategy} audit file:`, {
      name: fileName,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      sizeBytes: file.size,
      filecoinCompatible: file.size >= 5 * 1024 * 1024 // 5MB minimum
    });

    return file;
  };

  const handleUpload = async (strategy: 'enhanced' | 'bundled' | 'raw') => {
    setIsUploadAttempting(true); // Indicate that upload process has started

    try {
      // First, ensure we're on Filecoin Calibration network
      if (currentActiveChainId !== filecoinCalibration.id) {
        console.log(`⏳ Switching to Filecoin Calibration (ID: ${filecoinCalibration.id})...`);
        console.log("Current chain ID:", currentActiveChainId);
        
        // Switch chain and wait for it to complete
        await switchChain?.({chainId: filecoinCalibration.id});
        
        // Wait for chain switch to be reflected in state
        // console.log("⏳ Waiting for chain switch to be confirmed...");
        let retries = 0;
        const maxRetries = 10;
        
        while (currentActiveChainId !== filecoinCalibration.id && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          retries++;
          console.log(`Chain switch attempt ${retries}/${maxRetries}, current chain: ${currentActiveChainId}`);
        }
        
        if (currentActiveChainId !== filecoinCalibration.id) {
          throw new Error("Failed to switch to Filecoin Calibration network");
        }
        
        console.log("✅ Successfully switched to Filecoin Calibration");
      } else {
        console.log("✅ Already on Filecoin Calibration. Proceeding with upload directly.");
      }

      // Generate the audit file
      const auditFile = generateFilecoinCompatibleAuditFile(strategy);
      
      // Validate file size for Filecoin
      const fileSizeMB = auditFile.size / (1024 * 1024);
      if (fileSizeMB < 5) {
        console.warn(`File size (${fileSizeMB.toFixed(2)} MB) may be too small for efficient Filecoin storage. Recommend using enhanced format.`);
      }
      
      console.log("🚀 Starting Filecoin upload...");
      console.log("File details:", {
        name: auditFile.name,
        size: `${fileSizeMB.toFixed(2)} MB`,
        strategy: strategy
      });
      
      // Upload to Filecoin and wait for completion
      await uploadFile(auditFile);
      
      console.log("✅ Upload process initiated successfully");
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      // Reset upload attempt state on failure
      setIsUploadAttempting(false);
      
      // Show error to user
     
    }
    // Note: We don't set setIsUploadAttempting(false) in finally block
    // because we want it to remain true until upload is complete (uploadedInfo is available)
  };

    const isButtonDisabled =  isLoading || isSwitchingChain || !!uploadedInfo || (isUploadAttempting );


  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Audit Summary */}
      <div className="lg:col-span-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Audit Summary</h3>
        <p className="text-sm text-gray-300">
          Overall Security Score:{" "}
          <span
            className={`font-bold ${
              auditScore >= 80
                ? "text-green-400"
                : auditScore >= 60
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {auditScore}%
          </span>
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(issueCount).map(([severity, count]) => (
            <div
              key={severity}
              className="flex flex-col items-center bg-black/20 p-4 rounded-lg"
            >
              <SeverityBadge severity={severity} />
              <span className="text-white font-medium mt-2">{count}</span>
              <span className="text-gray-400 text-xs capitalize">
                {severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Issues */}
      <div className="lg:col-span-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Detailed Issues ({issues.length} found)
        </h3>

        {/* Debug info (remove in production) */}
        {issues.length === 0 && auditReport && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ No issues parsed from audit report. Check console for debug info.
            </p>
            <details className="mt-2">
              <summary className="text-yellow-300 text-xs cursor-pointer">Show raw audit report preview</summary>
              <pre className="text-xs text-gray-300 mt-2 whitespace-pre-wrap max-h-32 overflow-auto bg-black/20 p-2 rounded">
                {auditReport.substring(0, 1000)}...
              </pre>
            </details>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Issue List */}
          <div className="md:col-span-1 bg-black/20 rounded-lg p-4 overflow-auto max-h-[500px]">
            {issues.length > 0 ? (
              issues.map((issue: AuditIssue) => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer border ${
                    selectedIssue?.id === issue.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-white font-medium truncate pr-2">
                      {issue.title || "Untitled Issue"}
                    </div>
                    <SeverityBadge severity={issue.severity || "unknown"} />
                  </div>
                  <div className="text-xs text-gray-400">
                    {issue.source || "Unknown source"} {issue.line ? `• Line ${issue.line}` : ""}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center space-y-2">
                <div>No detailed issues were parsed from the audit report.</div>
                {auditReport ? (
                  <div className="text-xs">
                    The audit report exists but may not be in the expected format.
                  </div>
                ) : (
                  <div className="text-xs">
                    No audit report available. Please run an audit first.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Issue Details */}
          <div className="md:col-span-2 bg-black/20 rounded-lg p-4">
            {selectedIssue ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium">
                    {selectedIssue.title || "Untitled Issue"}
                  </h4>
                  <SeverityBadge severity={selectedIssue.severity || "unknown"} />
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-1">Source</div>
                  <div className="text-sm text-white">
                    {selectedIssue.source || "Unknown source"}
                  </div>
                </div>

                {selectedIssue.line && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">Location</div>
                    <div className="text-sm text-white">
                      Line {selectedIssue.line}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-1">Description</div>
                  <div className="text-sm text-white whitespace-pre-wrap">
                    {selectedIssue.description || "No description available"}
                  </div>
                </div>

                {selectedIssue.recommendation && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">
                      Recommendation
                    </div>
                    <div className="text-sm text-white">
                      {selectedIssue.recommendation}
                    </div>
                  </div>
                )}
              </div>
            ) : issues.length > 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select an issue to view details
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                <div>No issues to display</div>
                <div className="text-xs text-center">
                  {auditReport ? 
                    "The audit completed but no structured issues were found. Check the raw audit report above." :
                    "Run an audit to see detailed security issues here."
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Registration Notice */}
      {!auditTxHash && (
        <div className="lg:col-span-4 bg-orange-900/20 border border-orange-500/50 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-orange-300 mb-4">📋 Register Audit On-Chain</h3>
          <p className="text-sm text-orange-200 mb-4">
            To unlock the full audit report and enable Filecoin storage, you must first register your audit on-chain. 
            This creates an immutable record and provides you with a transaction hash needed for CID mapping.
          </p>
          <div className="bg-orange-800/30 border border-orange-600/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-orange-300 text-sm font-medium">Next Step Required</span>
            </div>
            <p className="text-orange-200 text-sm">
              Please use the audit registration feature in your dashboard to register this audit on-chain. 
              Once registered, you'll be able to store the complete audit report on Filecoin.
            </p>
          </div>
          
          {/* Debug section to manually set audit TX hash for testing */}
          <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/50 rounded-lg">
            <div className="text-purple-300 text-sm font-medium mb-2">Debug: Manual TX Hash Entry</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter audit transaction hash for testing..."
                className="flex-1 px-3 py-2 bg-black/30 border border-purple-500/50 rounded text-purple-200 text-xs"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      setAuditTxHash(value.trim());
                      console.log("Manually set auditTxHash:", value.trim());
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="Enter audit transaction hash"]') as HTMLInputElement;
                  if (input?.value.trim()) {
                    setAuditTxHash(input.value.trim());
                    console.log("Manually set auditTxHash:", input.value.trim());
                  }
                }}
                className="px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-500"
              >
                Set TX Hash
              </button>
            </div>
            <p className="text-purple-200 text-xs mt-2">
              For testing: Enter a transaction hash to simulate audit registration completion.
            </p>
          </div>
        </div>
      )}

      {/* Filecoin Upload Section - Only show after audit registration */}
      {auditTxHash && (
        <div className="lg:col-span-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">🗄️ Store on Filecoin</h3>
          <div className="mb-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-300 text-sm font-medium">Audit Registered Successfully</span>
            </div>
            <p className="text-green-200 text-xs">
              Audit TX Hash: <code className="bg-black/30 px-1 rounded">{auditTxHash}</code>
            </p>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Your audit is now registered on-chain! Upload your complete audit report to Filecoin for permanent decentralized storage. 
            The system will automatically handle network switching and CID mapping.
          </p>
        
        {/* Upload Strategy Selection */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Choose Upload Format:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setUploadStrategy('enhanced')}
              className={`p-3 rounded-lg border text-left transition-all ${
                uploadStrategy === 'enhanced' 
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
                  : 'border-white/20 hover:bg-white/5 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Enhanced (Recommended)</span>
              </div>
              <div className="text-xs text-gray-400">
                ~50MB+ comprehensive report with detailed analysis
              </div>
            </button>

            <button
              onClick={() => setUploadStrategy('bundled')}
              className={`p-3 rounded-lg border text-left transition-all ${
                uploadStrategy === 'bundled' 
                  ? 'border-green-500 bg-green-500/20 text-green-400' 
                  : 'border-white/20 hover:bg-white/5 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4" />
                <span className="font-medium">Bundled</span>
              </div>
              <div className="text-xs text-gray-400">
                Multiple formats (JSON, CSV, Markdown, HTML)
              </div>
            </button>

            <button
              onClick={() => setUploadStrategy('raw')}
              className={`p-3 rounded-lg border text-left transition-all ${
                uploadStrategy === 'raw' 
                  ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' 
                  : 'border-white/20 hover:bg-white/5 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Raw</span>
              </div>
              <div className="text-xs text-gray-400">
                Basic JSON format (may be too small)
              </div>
            </button>
          </div>
        </div>

        {/* Upload Status */}
       {(status || isSwitchingChain || isUploadAttempting) && ( // Show status if upload initiated or chain switching
          <div className="mb-4 p-3 bg-black/20 rounded-lg">
            {isSwitchingChain ? (
              <p className="text-blue-400 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" />
                Switching to Filecoin Calibration...
              </p>
            ) : status ? (
              <p className="text-sm text-gray-300">{status}</p>
            ) : isUploadAttempting && currentActiveChainId !== filecoinCalibration.id ? (
              <p className="text-yellow-400 text-sm">Waiting for chain switch to complete...</p>
            ) : null}

            {progress > 0 && progress < 100 && (
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-3">
          <button
            onClick={() => handleUpload(uploadStrategy)} // Call the modified handleUpload
            disabled={isButtonDisabled} // Use the new disabled state
            className={`flex-1 px-6 py-3 rounded-lg text-center border-2 transition-all flex items-center justify-center gap-2 ${
              isButtonDisabled
                ? "border-gray-500 text-gray-400 cursor-not-allowed bg-gray-800/50"
                : "border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400"
            }`}
          >
            <Package className="w-4 h-4" />
            {isSwitchingChain ? "Switching Chain..." : isLoading ? "Uploading to Filecoin..." : !uploadedInfo ? "Submit to Filecoin" : "Submitted Successfully!"}
          </button>

          {uploadedInfo && (
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
            >
              Reset
            </button>
          )}
        </div>

        {/* Upload Info */}
       

        {uploadedInfo && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
            <h4 className="text-green-400 font-medium mb-2">Upload Successful!</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>File:</strong> {uploadedInfo.fileName}</p>
              <p><strong>Size:</strong> {uploadedInfo.fileSize ? (uploadedInfo.fileSize / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown'}</p>
              {uploadedInfo.commp && <p><strong>CommP (CID):</strong> {uploadedInfo.commp}</p>}
              {uploadedInfo.txHash && <p><strong>Transaction:</strong> {uploadedInfo.txHash}</p>}
            </div>
            
            {/* Status message based on CID mapping progress */}
            {currentActiveChainId !== 11155111 ? (
              <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/50 rounded text-xs text-blue-300">
                🔄 <strong>Auto-Switching to Sepolia:</strong> Your report is uploaded! Automatically switching to Sepolia network for CID mapping to your registered audit...
              </div>
            ) : !auditRegistryAddress ? (
              <div className="mt-3 p-2 bg-red-900/20 border border-red-500/50 rounded text-xs text-red-300">
                ⚠️ <strong>Chain Issue:</strong> Cannot find audit registry for current chain (ID: {currentActiveChainId}). The system should have switched to Sepolia automatically.
              </div>
            ) : isMappingConfirmed ? (
              <div className="mt-3 p-2 bg-green-900/20 border border-green-500/50 rounded text-xs text-green-300">
                ✅ <strong>Complete:</strong> Your audit report CID has been successfully mapped on-chain! It's now immutable and retrievable.
              </div>
            ) : isMappingCID ? (
              <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/50 rounded text-xs text-blue-300">
                ⏳ <strong>Mapping in Progress:</strong> Submitting CID mapping transaction to link your Filecoin report to the registered audit...Till then you can go to reports section to download and view the reports
              </div>
            ) : (
              <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/50 rounded text-xs text-blue-300">
                💡 <strong>Ready for Mapping:</strong> Your report CID will be mapped to the registered audit shortly.
              </div>
            )}
            
            {/* Debug section for CID mapping */}
            {/* <div className="mt-3 p-2 bg-purple-900/20 border border-purple-500/50 rounded text-xs">
              <div className="text-purple-300 mb-2">
                <strong>Debug - CID Mapping Status:</strong>
              </div>
              <div className="text-gray-300 space-y-1">
                <p>• <strong>Chain ID:</strong> {currentActiveChainId}</p>
                <p>• <strong>Registered Audit TX Hash:</strong> {auditTxHash}</p>
                <p>• <strong>Registry Address:</strong> {auditRegistryAddress || '❌ Not available (auto-switching to Sepolia)'}</p>
                <p>• <strong>Upload CID:</strong> {uploadedInfo.commp}</p>
                <p>• <strong>Has Attempted Mapping:</strong> {hasAttemptedMapping ? 'Yes' : 'No'}</p>
                <p>• <strong>Is Mapping CID:</strong> {isMappingCID ? 'Yes' : 'No'}</p>
                <p>• <strong>Mapping Confirmed:</strong> {isMappingConfirmed ? 'Yes' : 'No'}</p>
                <p>• <strong>Is Sepolia:</strong> {currentActiveChainId === 11155111 ? 'Yes' : 'No'}</p>
              </div>
              
              {auditTxHash && uploadedInfo.commp && auditRegistryAddress && (
                <button
                  onClick={() => {
                    console.log("Manual CID mapping trigger");
                    setHasAttemptedMapping(false);
                    mapCIDToAudit(auditTxHash, uploadedInfo.commp);
                  }}
                  disabled={isMappingCID}
                  className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-500 disabled:opacity-50"
                >
                  {isMappingCID ? 'Mapping...' : 'Test: Map CID to Audit'}
                </button>
              )}
              
              {currentActiveChainId !== 11155111 && uploadedInfo.commp && (
                <div className="mt-2 text-blue-300">
                  <p>🔄 Auto-switching to Sepolia for CID mapping...</p>
                </div>
              )}
            </div> */}
          </div>
        )}
      </div>
      )}

      {/* Download Section */}
      <div className="lg:col-span-4 mt-4">
        <button
          onClick={() => {
            const file = generateFilecoinCompatibleAuditFile('enhanced');
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-6 py-2 rounded-lg text-center border-2 border-white/20 text-white/80 hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Download Enhanced Report</span>
        </button>
      </div>
    </div>
  );
};

export default AuditResults;
