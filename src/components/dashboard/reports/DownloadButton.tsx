import { Download, FileX } from "lucide-react";
import { useDownloadRoot } from "@/hooks/useDownload";
import { useToast } from "@/hooks/use-toast";
import { type Contract } from "@/store/auditStore";
import { useSwitchChain, useChainId } from "wagmi";
import { filecoinCalibration } from 'wagmi/chains';

interface DownloadButtonProps {
  contract: Contract;
}

/**
 * DownloadButton component for downloading audit reports from Filecoin
 * Uses the actual Synapse SDK to download files using the stored CID
 */

export const DownloadButton = ({ contract }: DownloadButtonProps) => {
  const { toast } = useToast();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();

  // Generate filename based on contract information
  const filename = `audit-report-${contract.name.replace(/\s+/g, '-')}-${contract.id}.json`;
  
  // Use the download hook with the contract's report CID
  const { downloadMutation } = useDownloadRoot(
    contract.reportCID || "dummy", 
    filename
  );

  const handleDownload = async () => {
    if (!contract.reportCID || !contract.isUploaded) {
      toast({
        title: "No Report Available",
        description: "This contract doesn't have an uploaded report",
        variant: "destructive",
      });
      return;
    }

    try {
      // Step 1: Switch to Filecoin Calibration testnet if not already on it
      if (currentChainId !== filecoinCalibration.id) {
        
        
        await switchChain?.({ chainId: filecoinCalibration.id });
        
        // Wait for chain switch to complete
        let retries = 0;
        const maxRetries = 10;
        
        while (currentChainId !== filecoinCalibration.id && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries++;
        }
        
        if (currentChainId !== filecoinCalibration.id) {
          throw new Error("Failed to switch to Filecoin Calibration network");
        }
        
        console.log("✅ Successfully switched to Filecoin Calibration");
      } else {
        console.log("✅ Already on Filecoin Calibration network");
      }

      // Step 2: Download the file from Filecoin
      console.log("🚀 Starting download from Filecoin...");
      downloadMutation.mutate(undefined, {
        onSuccess: async () => {
          toast({
            title: "Download Complete",
            description: `Audit report for ${contract.name} downloaded successfully`,
          });
          
          // Step 3: Switch to Sepolia after successful download
          try {
            const sepoliaChainId = 11155111;
            await switchChain?.({ chainId: sepoliaChainId });
            
           
          } catch (switchError) {
            console.error("Failed to switch to Sepolia after download:", switchError);
            toast({
              title: "Network Switch Warning",
              description: "Download successful, but failed to switch to Sepolia",
              variant: "destructive",
            });
          }
        },
        onError: (error) => {
          console.error("Download error:", error);
          toast({
            title: "Download Failed",
            description: error instanceof Error ? error.message : "Failed to download report",
            variant: "destructive",
          });
        }
      });
      
    } catch (error) {
      console.error("Network switch or download error:", error);
      
    }
  };

  if (!contract.isUploaded) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-500/10 text-gray-400">
        <FileX className="w-4 h-4" />
        <span className="text-xs">Not Uploaded</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloadMutation.isPending}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download Audit Report (Auto-switches to Filecoin Calibration)"
    >
      {downloadMutation.isPending ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="text-xs">
        {downloadMutation.isPending ? "Downloading..." : "Download"}
      </span>
      {currentChainId !== filecoinCalibration.id && (
        <span className="text-xs text-orange-400 ml-1">
          (Will switch networks)
        </span>
      )}
    </button>
  );
};
