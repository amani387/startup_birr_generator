export const APP_NAME = "Top Mela";

export const WITHDRAWAL_RULES = {
  minBalanceToUnlock: 700,
  retentionPercent: 30,
  minWithdrawalAmount: 100,
} as const;

export const REFERRAL_COMMISSION = {
  level1: 10,
  level2: 10,
  level3: 10,
} as const;
