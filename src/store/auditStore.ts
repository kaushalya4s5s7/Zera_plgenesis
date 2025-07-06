// store/auditStore.ts
import { create } from "zustand";

// Define the issue interface
interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: string;
  source: string;
  line?: number | null;
  recommendation?: string;
}
export interface Contract {
  id: number;
  name: string;
  chain: string;
  rating: number;
  auditor: string;
  auditorFull: string;
  date: string;
  contractHash: string;
  reportCID?: string;
  isUploaded: boolean;
}
// Define issue count interface
interface IssueCount {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

// Define the store state and actions
interface AuditStore {
  // State
  auditScore: number;
  auditReport: string;
  contractHash: string;
  contracts: Contract[];
  issues: AuditIssue[];
  issueCount: IssueCount;
  isLocked: boolean;
  uploadedReportCID: string | null; // Store the uploaded report CID
  currentAuditHasUpload: boolean; // Track if current audit has an upload
  auditTxHash: string | null; // Store the transaction hash from audit registration

  // Actions
  setContracts: (contracts: Contract[]) => void;
  setAuditScore: (score: number) => void;
  setAuditReport: (report: string) => void;
  setContractHash: (hash: string) => void;
  setIssues: (issues: AuditIssue[]) => void;
  setIssueCount: (count: IssueCount) => void;
  setIsLocked: (locked: boolean) => void;
  setUploadedReportCID: (cid: string | null) => void; // New action to store CID
  setCurrentAuditHasUpload: (hasUpload: boolean) => void; // New action to track upload status
  setAuditTxHash: (txHash: string | null) => void; // New action to store audit tx hash

  // Reset state
  resetAuditState: () => void;
}

// Create the store
const useAuditStore = create<AuditStore>()((set) => ({
  // Initial state
  auditScore: 0,
  auditReport: "",
  contracts: [],
  contractHash: "",
  issues: [],
  issueCount: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  },
  isLocked: true,
  uploadedReportCID: null, // Initialize as null
  currentAuditHasUpload: false, // Initialize as false
  auditTxHash: null, // Initialize as null

  // Actions
  setContracts: (contracts) => set({ contracts }),
  setAuditScore: (score) => set({ auditScore: score }),
  setAuditReport: (report) => set({ auditReport: report }),
  setContractHash: (hash) => set({ contractHash: hash }),
  setIssues: (issues) => set({ issues }),
  setIssueCount: (count) => set({ issueCount: count }),
  setIsLocked: (locked) => set({ isLocked: locked }),
  setUploadedReportCID: (cid) => set({ uploadedReportCID: cid }), // New action implementation
  setCurrentAuditHasUpload: (hasUpload) => set({ currentAuditHasUpload: hasUpload }), // New action implementation
  setAuditTxHash: (txHash) => {
    console.log("=== AUDIT STORE: setAuditTxHash called ===");
    console.log("Previous auditTxHash:", useAuditStore.getState().auditTxHash);
    console.log("New auditTxHash:", txHash);
    console.log("========================================");
    set({ auditTxHash: txHash });
  }, // New action implementation with debug logging

  // Reset state function
  resetAuditState: () =>
    set({
      auditScore: 0,
      auditReport: "",
      contractHash: "",
      contracts: [],
      issues: [],
      issueCount: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      },
      isLocked: true,
      uploadedReportCID: null, // Reset CID as well
      currentAuditHasUpload: false, // Reset upload status as well
      auditTxHash: null, // Reset audit tx hash as well
    }),
}));

export default useAuditStore;
