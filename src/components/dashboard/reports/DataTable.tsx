"use client";
import { useState, useEffect } from "react";
import { useAccount, useChainId, usePublicClient, useReadContract } from "wagmi";
import { formatEther } from "viem";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ExternalLink,
  Check,
  Wallet,
  AlertCircle,
  RefreshCw,

} from "lucide-react";
import { useFileUpload } from "@/hooks/useFIleUpload";
import { useToast } from "@/hooks/use-toast";
import { DownloadButton } from "./DownloadButton";
import {
  CONTRACT_ADDRESSES,
  AUDIT_REGISTRY_ABI,
  CHAIN_CONFIG,
  type ChainKey,
} from "../../../../utils/Contract";
import { config } from "../../../../config";

import useAuditStore, { type Contract } from "@/store/auditStore";

type DataTableProps = {
  className?: string;
};

// Helper function to truncate addresses (matching Web3Zone pattern)
const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

// Helper function to get CID for an audit from the contract
const getAuditCIDFromContract = async (
  publicClient: any, 
  contractAddress: string, 
  contractHash: string, 
  auditor: string, 
  timestamp: number
): Promise<string | null> => {
  try {
    // Get AuditRegistered events for this contract hash and auditor
    const logs = await publicClient.getLogs({
      address: contractAddress as `0x${string}`,
      event: {
        type: 'event',
        name: 'AuditRegistered',
        inputs: [
          { name: 'contractHash', type: 'bytes32', indexed: true },
          { name: 'stars', type: 'uint8', indexed: false },
          { name: 'summary', type: 'string', indexed: false },
          { name: 'auditor', type: 'address', indexed: true },
          { name: 'timestamp', type: 'uint256', indexed: false },
          { name: 'txHash', type: 'bytes32', indexed: true },
        ],
      },
      args: {
        contractHash: contractHash as `0x${string}`,
        auditor: auditor as `0x${string}`,
      },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    // Find the event that matches the timestamp
    for (const log of logs) {
      const eventTimestamp = Number(log.args?.timestamp || 0);
      if (eventTimestamp === timestamp && log.args?.txHash) {
        // Get the CID using the transaction hash
        const cid = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUDIT_REGISTRY_ABI,
          functionName: 'getAuditCID',
          args: [log.args.txHash],
        });

        if (cid && cid.length > 0) {
          console.log("✅ Retrieved CID from contract:", cid);
          return cid as string;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting CID from contract:", error);
    return null;
  }
};

const DataTable = ({ className }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [chainFilter, setChainFilter] = useState<string | null>(null);
  const [auditorFilter, setAuditorFilter] = useState<string | null>(null);
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 100 });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh trigger
  const itemsPerPage = 5;
  const { toast } = useToast();

  // Wagmi hooks (matching Web3Zone pattern)
  const { isConnected, address, chain } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  
  const { contracts, setContracts, contractHash: currentContractHash, uploadedReportCID, currentAuditHasUpload } = useAuditStore();
  const uploadedInfo = useFileUpload();
  // Get effective chain info (matching Web3Zone pattern)
  const effectiveChain = chain;
  const effectiveChainId = chain?.id || chainId;

  // Debug logging (matching Web3Zone pattern)
  useEffect(() => {
    console.log("DataTable Debug Info:", {
      isConnected,
      address,
      chain,
      chainId,
      effectiveChainId,
      publicClient: !!publicClient,
    });
  }, [isConnected, address, chain, chainId, effectiveChainId, publicClient]);

  // Manual refresh function
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    setRefreshKey(prev => prev + 1);
  };

  // Listen for audit registration events
  useEffect(() => {
    const handleAuditRegistered = () => {
      console.log("Audit registered event received, refreshing data...");
      handleRefresh();
    };

    window.addEventListener('auditRegistered', handleAuditRegistered);
    return () => {
      window.removeEventListener('auditRegistered', handleAuditRegistered);
    };
  }, []);

  // Fetch contract data using wagmi
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !publicClient || !effectiveChain) {
        return;
      }

      try {
        setIsLoading(true);

        // Check if we're on the correct network
        if (effectiveChainId !== CHAIN_CONFIG.Sepolia.chainId) {
          toast({
            title: "Wrong Network",
            description: "Please click on download button for download  ",
            variant: "destructive",
          });
          return;
        }

        // Get contract address for current chain
        const contractAddress =
          CONTRACT_ADDRESSES[effectiveChain.name as ChainKey] ||
          CONTRACT_ADDRESSES.Pharos;

        if (!contractAddress) {
          throw new Error("Contract address not found for current chain");
        }

        // Verify contract exists using publicClient
        const code = await publicClient.getBytecode({
          address: contractAddress as `0x${string}`,
        });

        if (!code || code === "0x") {
          throw new Error("No contract deployed at this address");
        }

        // Read total contracts using publicClient
        const totalContracts = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUDIT_REGISTRY_ABI,
          functionName: "getTotalContracts",
        });

        const allAudits = [];
        const total = Number(totalContracts);

        for (let i = 0; i < total; i++) {
          try {
            // Get contract hash by index
            const hash = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: AUDIT_REGISTRY_ABI,
              functionName: "getContractHashByIndex",
              args: [BigInt(i)],
            });

            // Get latest audit for this hash
            const audit = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: AUDIT_REGISTRY_ABI,
              functionName: "getLatestAudit",
              args: [hash],
            });

            // Extract report CID from contract first, fallback to summary parsing
            let reportCID: string | undefined;
            let isUploaded = false;

            // Check if this is the current audit being worked on and has an upload
            const isCurrentAudit = hash === currentContractHash;
            
            if (!config.demoMode) {
              // Production mode: Try to get CID from contract first
              console.log("=== DATATABLE CID EXTRACTION ===");
              console.log("Checking audit for CID:", { hash, auditor: audit.auditor, timestamp: audit.timestamp });
              
              try {
                // First, try to get CID from the contract
                const contractCID = await getAuditCIDFromContract(
                  publicClient,
                  contractAddress,
                  hash,
                  audit.auditor,
                  Number(audit.timestamp)
                );
                
                if (contractCID) {
                  reportCID = contractCID;
                  isUploaded = true;
                  console.log("✅ Retrieved CID from contract:", reportCID);
                } else {
                  // Fallback: Extract CID from summary for backwards compatibility
                  console.log("No CID found in contract, checking summary for CID:", audit.summary);
                  const cidMatch = audit.summary.match(/Report CID:\s*([a-zA-Z2-7]{40,})/);
                  if (cidMatch) {
                    reportCID = cidMatch[1];
                    isUploaded = true;
                    console.log("✅ Extracted CID from summary (fallback):", reportCID);
                  } else {
                    console.log("❌ No CID found in summary either. Summary was:", audit.summary);
                  }
                }
              } catch (error) {
                console.error("Error getting CID:", error);
                // Fallback to summary parsing on error
                const cidMatch = audit.summary.match(/Report CID:\s*([a-zA-Z2-7]{40,})/);
                if (cidMatch) {
                  reportCID = cidMatch[1];
                  isUploaded = true;
                  console.log("✅ Extracted CID from summary (error fallback):", reportCID);
                }
              }
              
              // If this is the current audit and we have an upload in progress, use that data
              if (isCurrentAudit && currentAuditHasUpload && uploadedReportCID) {
                reportCID = uploadedReportCID;
                isUploaded = true;
                console.log("✅ Using current audit upload CID:", reportCID);
              }
              
              console.log("Final report status - CID:", reportCID, "isUploaded:", isUploaded);
              console.log("==================================");
            } else {
              // Demo mode: Use test CIDs for simulation
              const hasReport = i % 3 === 0;
              const testCIDs = [
                "QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP2MNKQX1QakrCrf6Y", // Example valid CID
                "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG", // Example valid CID
                "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", // Example valid CID
              ];
              reportCID = hasReport ? testCIDs[i % testCIDs.length] : undefined;
              isUploaded = !!reportCID;
            }

            allAudits.unshift({
              id: i + 1,
              name: `Contract ${i}`,
              chain: effectiveChain.name || "Unknown",
              rating: Number(audit.stars),
              auditor: truncateAddress(audit.auditor),
              auditorFull: audit.auditor,
              date: new Date(Number(audit.timestamp) * 1000).toLocaleDateString(),
              contractHash: hash,
              reportCID,
              isUploaded,
            });
            
            console.log(`Audit ${i} processed:`, {
              contractHash: hash,
              summary: audit.summary,
              reportCID,
              isUploaded,
              stars: audit.stars,
              auditor: audit.auditor
            });
          } catch (error) {
            console.error(`Error fetching audit ${i}:`, error);
            continue;
          }
        }

        setContracts(allAudits);
        
        toast({
          title: "Data Loaded",
          description: `Successfully loaded ${allAudits.length} contract reports`,
        });

      } catch (error) {
        console.error("Contract call error:", error);
        toast({
          title: "Contract Error",
          description: error instanceof Error ? error.message : "Failed to read from the smart contract",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isConnected, publicClient, effectiveChain, effectiveChainId, toast, setContracts, refreshKey, currentContractHash, uploadedReportCID, currentAuditHasUpload]); // Ensure all dependencies are correct
  // Helper function to determine the color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "bg-gradient-to-r from-secondary to-primary";
    if (rating >= 80) return "bg-gradient-to-r from-cyan to-primary";
    if (rating >= 70) return "bg-gradient-to-r from-orange to-primary";
    return "bg-gradient-to-r from-red-500 to-orange";
  };

  // Filter contracts based on search term and filters
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.chain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.auditor.toLowerCase().includes(searchTerm.toLowerCase()) ;
      // contract.auditorFull?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChainFilter = !chainFilter || contract.chain === chainFilter;
    // const matchesAuditorFilter =
    //   !auditorFilter || 
    //   contract.auditor === auditorFilter || 
    //   contract.auditorFull === auditorFilter;
    const matchesRatingRange =
      contract.rating >= ratingRange.min && contract.rating <= ratingRange.max;
    return (
      matchesSearch &&
      matchesChainFilter &&
      // matchesAuditorFilter &&
      matchesRatingRange
    );
  });

  // Get unique chains and auditors for filters
  const uniqueChains = [...new Set(contracts.map(c => c.chain))];
  const uniqueAuditors = [...new Set(contracts.map(c =>  c.auditor))];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset filters
  const resetFilters = () => {
    setChainFilter(null);
    setAuditorFilter(null);
    setRatingRange({ min: 0, max: 100 });
    setShowFilterMenu(false);
    toast({
      title: "Filters Reset",
      description: "All report filters have been cleared",
    });
  };

  const handleViewReport = (contractId: number) => {
    toast({
      title: "Report Opened",
      description: `Viewing detailed report for contract #${contractId}`,
    });
  };

  const handleApproveReport = (contractId: number) => {
    toast({
      title: "Report Approved",
      description: `Contract #${contractId} report has been approved`,
      variant: "default",
    });
  };

  // Render connection status (matching Web3Zone pattern)
  if (!isConnected || !address) {
    return (
      <div className={`bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 ${className}`}>
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Wallet Not Connected</h3>
          <p className="text-gray-400">
            Please connect your wallet to view contract reports.
          </p>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Loading Contract Reports</h3>
          <p className="text-gray-400">
            Fetching data from the blockchain...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 ${className}`}
    >
      {/* Header with connection info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Contract Reports</h3>
          <p className="text-sm text-gray-400">
            Connected: {truncateAddress(address)} on {effectiveChain?.name || 'Unknown Chain'}
            {config.demoMode ? (
              <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">DEMO MODE</span>
            ) : (
              <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">PRODUCTION</span>
            )}
            {/* Debug info for current audit */}
            {currentContractHash && (
              <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                Current: {currentContractHash.slice(0, 8)}... 
                {currentAuditHasUpload ? ' (Has Upload)' : ' (No Upload)'}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900-dark border border-white/20 rounded-lg p-4 z-10">
                <h4 className="text-sm font-medium text-white mb-3">
                  Filter Reports
                </h4>
                <div className="space-y-4">
                  {/* Chain Filter */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Chain
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-1.5"
                      value={chainFilter || ""}
                      onChange={(e) => setChainFilter(e.target.value || null)}
                    >
                      <option value="">All Chains</option>
                      {uniqueChains.map(chain => (
                        <option key={chain} value={chain}>{chain}</option>
                      ))}
                    </select>
                  </div>
                  {/* Auditor Filter */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Auditor
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-1.5"
                      value={auditorFilter || ""}
                      onChange={(e) => setAuditorFilter(e.target.value || null)}
                    >
                      <option value="">All Auditors</option>
                      {uniqueAuditors.map(auditor => (
                        <option key={auditor} value={auditor}>
                          {truncateAddress(auditor)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Rating Range */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Rating Range: {ratingRange.min} - {ratingRange.max}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={ratingRange.min}
                        onChange={(e) =>
                          setRatingRange({
                            ...ratingRange,
                            min: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={ratingRange.max}
                        onChange={(e) =>
                          setRatingRange({
                            ...ratingRange,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 text-xs text-red-400 hover:text-red-300"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowFilterMenu(false)}
                      className="px-3 py-1 text-xs bg-primary text-white rounded"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Network Warning */}
      {effectiveChainId !== CHAIN_CONFIG.Sepolia.chainId && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-sm">
           Please click on download button for download
           </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-white/5 text-gray-400">
            <tr>
              <th className="px-6 py-3 rounded-tl-lg">Contract</th>
              <th className="px-6 py-3">Chain</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Auditor</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Report</th>
              <th className="px-6 py-3 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContracts.length > 0 ? (
              currentContracts.map((contract, index) => (
                <tr
                  key={contract.id}
                  className={`border-b ${
                    index === currentContracts.length - 1
                      ? ""
                      : "border-white/10"
                  } hover:bg-white/5`}
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {contract.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                      {contract.chain}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-white/10">
                        <div
                          className={`h-2 rounded-full ${getRatingColor(
                            contract.rating
                          )}`}
                          style={{ width: `${contract.rating}%` }}
                        ></div>
                      </div>
                      <span>{contract.rating}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="text-primary hover:text-primary/80 cursor-pointer"
                      
                    >
                      {contract.auditor}
                    </span>
                  </td>
                  <td className="px-6 py-4">{contract.date}</td>
                  <td className="px-6 py-4">
                    <DownloadButton contract={contract} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewReport(contract.id)}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="View Report"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApproveReport(contract.id)}
                        className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                        title="Approve Report"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  {contracts.length === 0 ? "No contract reports found" : "No reports match your search criteria"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredContracts.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredContracts.length)} of{" "}
            {filteredContracts.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({
              length: Math.ceil(filteredContracts.length / itemsPerPage),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-8 h-8 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                paginate(
                  Math.min(
                    currentPage + 1,
                    Math.ceil(filteredContracts.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filteredContracts.length / itemsPerPage)
              }
              className={`p-2 rounded-lg ${
                currentPage ===
                Math.ceil(filteredContracts.length / itemsPerPage)
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;