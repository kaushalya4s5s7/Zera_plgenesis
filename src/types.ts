export interface Root {
  rootId: number;
  rootCid: string;
  subrootCid: string;
  subrootOffset: number;
}

export interface ProofSetDetails {
  id: number;
  roots: Root[];
  nextChallengeEpoch: number;
}

export interface ProofSet {
  railId: number;
  payer: string;
  payee: string;
  commissionBps: number;
  metadata: string;
  rootMetadata: any[];
  clientDataSetId: number;
  withCDN: boolean;
  pdpVerifierProofSetId: number;
  nextRootId: number;
  currentRootCount: number;
  isLive: boolean;
  isManaged: boolean;
  details: ProofSetDetails | null;
}

export interface ProofSetsResponse {
  proofsets: ProofSet[];
}

/**
 * Interface for formatted balance data returned by useBalances
 */
export interface UseBalancesResponse {
  filBalance: bigint;
  usdfcBalance: bigint;
  pandoraBalance: bigint;
  filBalanceFormatted: number;
  usdfcBalanceFormatted: number;
  pandoraBalanceFormatted: number;
  persistenceDaysLeft: number;
  persistenceDaysLeftAtCurrentRate: number;
  isSufficient: boolean;
  isRateSufficient: boolean;
  isLockupSufficient: boolean;
  rateNeeded: bigint;
  totalLockupNeeded: bigint;
  depositNeeded: bigint;
  currentRateAllowanceGB: number;
  currentStorageGB: number;
  currentLockupAllowance: bigint;
}

export const defaultBalances: UseBalancesResponse = {
  filBalance: BigInt(0),
  usdfcBalance: BigInt(0),
  pandoraBalance: BigInt(0),
  filBalanceFormatted: 0,
  usdfcBalanceFormatted: 0,
  pandoraBalanceFormatted: 0,
  persistenceDaysLeft: 0,
  persistenceDaysLeftAtCurrentRate: 0,
  isSufficient: false,
  isRateSufficient: false,
  isLockupSufficient: false,
  rateNeeded: BigInt(0),
  totalLockupNeeded: BigInt(0),
  depositNeeded: BigInt(0),
  currentRateAllowanceGB: 0,
  currentStorageGB: 0,
  currentLockupAllowance: BigInt(0),
};

/**
 * Interface representing the Pandora balance data returned from the SDK
 */
export interface PandoraBalanceData {
  rateAllowanceNeeded: bigint;
  currentRateUsed: bigint;
  currentRateAllowance: bigint;
  currentLockupAllowance: bigint;
  currentLockupUsed: bigint;
}

/**
 * Interface representing the calculated storage metrics
 */
export interface StorageCalculationResult {
  /** The required rate allowance needed for storage */
  rateNeeded: bigint;
  /** The current rate used */
  rateUsed: bigint;
  /** The current storage usage in bytes */
  currentStorageBytes: bigint;
  /** The current storage usage in GB */
  currentStorageGB: number;
  /** The required lockup amount needed for storage persistence */
  totalLockupNeeded: bigint;
  /** The additional lockup amount needed for storage persistence */
  depositNeeded: bigint;
  /** Number of days left before lockup expires */
  persistenceDaysLeft: number;
  /** Number of days left before lockup expires at current rate */
  persistenceDaysLeftAtCurrentRate: number;
  /** Whether the current rate allowance is sufficient */
  isRateSufficient: boolean;
  /** Whether the current lockup allowance is sufficient for at least the minimum days threshold */
  isLockupSufficient: boolean;
  /** Whether both rate and lockup allowances are sufficient */
  isSufficient: boolean;
  /** The current rate allowance in GB */
  currentRateAllowanceGB: number;
  /** The current lockup allowance in USDFC */
  currentLockupAllowance: bigint;
}

export interface PaymentActionProps extends SectionProps {
  totalLockupNeeded?: bigint;
  currentLockupAllowance?: bigint;
  rateNeeded?: bigint;
  depositNeeded?: bigint;
  isProcessingPayment: boolean;
  onPayment: (params: {
    lockupAllowance: bigint;
    epochRateAllowance: bigint;
    depositAmount: bigint;
  }) => Promise<void>;
  handleRefetchBalances: () => Promise<void>;
}

export interface StatusMessageProps {
  status?: string;
}

export interface SectionProps {
  balances?: UseBalancesResponse;
  isLoading?: boolean;
}

export interface AllowanceItemProps {
  label: string;
  isSufficient?: boolean;
  isLoading?: boolean;
}