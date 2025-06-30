import {
  PandoraService,
  Synapse,
  TIME_CONSTANTS,
  SIZE_CONSTANTS,
} from "@filoz/synapse-sdk";
import { config } from "@/config";
import { PandoraBalanceData, StorageCalculationResult } from "@/src/types";

/**
 * Constants for storage pricing and calculations
 */
const STORAGE_CONSTANTS = {
  PRICE_PER_TB_PER_MONTH: BigInt(2) * BigInt(10) ** BigInt(18),
  PRICE_PER_TB_PER_MONTH_CDN: BigInt(3) * BigInt(10) ** BigInt(18),
} as const;

export const calculateStorageMetrics = async (
  synapse: Synapse,
  persistencePeriodDays: bigint = BigInt(config.persistencePeriod),
  storageCapacity: number = config.storageCapacity * Number(SIZE_CONSTANTS.GiB),
  minDaysThreshold: bigint = BigInt(config.minDaysThreshold)
): Promise<StorageCalculationResult> => {
  const pandoraService = new PandoraService(
    synapse.getProvider(),
    synapse.getPandoraAddress()
  );

  const pandoraBalance = await pandoraService.checkAllowanceForStorage(
    storageCapacity,
    config.withCDN,
    synapse.payments
  );

  const rateNeeded =
    pandoraBalance.rateAllowanceNeeded - pandoraBalance.currentRateUsed;
  const sizeInBytesBigint = BigInt(storageCapacity);

  const ratePerEpoch = calculateRatePerEpoch(sizeInBytesBigint);

  const lockupPerDay =
    BigInt(TIME_CONSTANTS.EPOCHS_PER_DAY) * ratePerEpoch;
  const lockupPerDayAtCurrentRate =
    BigInt(TIME_CONSTANTS.EPOCHS_PER_DAY) * pandoraBalance.currentRateUsed;

  const currentLockupRemaining =
    pandoraBalance.currentLockupAllowance - pandoraBalance.currentLockupUsed;

  const persistenceDaysLeft =
    Number(currentLockupRemaining) / Number(lockupPerDay);
  const persistenceDaysLeftAtCurrentRate =
    lockupPerDayAtCurrentRate > BigInt(0)
      ? Number(currentLockupRemaining) / Number(lockupPerDayAtCurrentRate)
      : currentLockupRemaining > BigInt(0)
        ? Infinity
        : 0;

  const lockupNeeded = calculateRequiredLockup(
    persistencePeriodDays,
    persistenceDaysLeft,
    lockupPerDay,
    pandoraBalance.currentLockupUsed
  );

  const { currentStorageBytes, currentStorageGB } =
    calculateCurrentStorageUsage(pandoraBalance, storageCapacity);

  const isRateSufficient = pandoraBalance.currentRateAllowance >= rateNeeded;
  const isLockupSufficient = persistenceDaysLeft >= Number(minDaysThreshold);
  const isSufficient = isRateSufficient && isLockupSufficient;

  const currentRateAllowanceGB = calculateRateAllowanceGB(
    pandoraBalance.currentRateAllowance
  );
  const depositNeeded =
    lockupNeeded - pandoraBalance.currentLockupAllowance;

  return {
    rateNeeded,
    rateUsed: pandoraBalance.currentRateUsed,
    currentStorageBytes,
    currentStorageGB,
    totalLockupNeeded: lockupNeeded,
    depositNeeded,
    persistenceDaysLeft,
    persistenceDaysLeftAtCurrentRate,
    isRateSufficient,
    isLockupSufficient,
    isSufficient,
    currentRateAllowanceGB,
    currentLockupAllowance: pandoraBalance.currentLockupAllowance,
  };
};

const getPricePerTBPerMonth = (): bigint => {
  return config.withCDN
    ? STORAGE_CONSTANTS.PRICE_PER_TB_PER_MONTH_CDN
    : STORAGE_CONSTANTS.PRICE_PER_TB_PER_MONTH;
};

const calculateRatePerEpoch = (sizeInBytes: bigint): bigint => {
  return (
    (getPricePerTBPerMonth() * sizeInBytes) /
    (SIZE_CONSTANTS.TiB * BigInt(TIME_CONSTANTS.EPOCHS_PER_MONTH))
  );
};

const calculateRateAllowanceGB = (rateAllowance: bigint): number => {
  const monthlyRate =
    rateAllowance * BigInt(TIME_CONSTANTS.EPOCHS_PER_MONTH);
  const bytesThatCanBeStored =
    (monthlyRate * SIZE_CONSTANTS.TiB) / getPricePerTBPerMonth();
  return Number(bytesThatCanBeStored) / Number(SIZE_CONSTANTS.GiB);
};

const calculateRequiredLockup = (
  persistencePeriodDays: bigint,
  persistenceDaysLeft: number,
  lockupPerDay: bigint,
  currentLockupUsed: bigint
): bigint => {
  return Number(persistencePeriodDays) > persistenceDaysLeft
    ? BigInt(
        parseInt(
          (
            (Number(persistencePeriodDays) - persistenceDaysLeft) *
              Number(lockupPerDay) +
            Number(currentLockupUsed)
          ).toString()
        )
      )
    : BigInt(0);
};

const calculateCurrentStorageUsage = (
  pandoraBalance: PandoraBalanceData,
  storageCapacity: number
): { currentStorageBytes: bigint; currentStorageGB: number } => {
  let currentStorageBytes = BigInt(0);
  let currentStorageGB = 0;

  if (
    pandoraBalance.currentRateUsed > BigInt(0) &&
    pandoraBalance.rateAllowanceNeeded > BigInt(0)
  ) {
    try {
      currentStorageBytes =
        (pandoraBalance.currentRateUsed * BigInt(storageCapacity)) /
        pandoraBalance.rateAllowanceNeeded;
      currentStorageGB = Number(currentStorageBytes) / (1024 * 1024 * 1024);
    } catch (error) {
      console.warn("Failed to calculate current storage usage:", error);
    }
  }

  return { currentStorageBytes, currentStorageGB };
};
