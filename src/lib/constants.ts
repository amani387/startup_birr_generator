export const APP_NAME = "Birr Tera";

/** Only this account can promote or demote admin roles. Cannot be deleted. */
export const SUPER_ADMIN_EMAIL = "amanaminte@gmail.com";

/** Google sign-in disabled until OAuth is configured in Supabase. */
// export const GOOGLE_AUTH_ENABLED = true;
export const GOOGLE_AUTH_ENABLED = false;

export type SocialTaskPlatform =
  | "facebook"
  | "telegram"
  | "youtube";

export type SocialTask = {
  id: string;
  label: string;
  reward: number;
  platform: SocialTaskPlatform;
  href: string;
};

/** Configure links via NEXT_PUBLIC_* env vars on the server. */
export const SOCIAL_TASKS: SocialTask[] = [
  {
    id: "facebook_follow",
    label: "Follow our Facebook page",
    reward: 1.0,
    platform: "facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL ?? "https://facebook.com",
  },
  {
    id: "facebook_share",
    label: "Share a Facebook post publicly",
    reward: 2.0,
    platform: "facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_SHARE_URL ?? "https://facebook.com",
  },
  {
    id: "facebook_comment",
    label: "Comment on a Facebook post",
    reward: 1.5,
    platform: "facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_COMMENT_URL ?? "https://facebook.com",
  },
  {
    id: "telegram_invite",
    label: "Invite 10 friends to our Telegram group",
    reward: 5.0,
    platform: "telegram",
    href: process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL ?? "https://t.me",
  },
  {
    id: "telegram_join",
    label: "Join our Telegram channel",
    reward: 1.0,
    platform: "telegram",
    href: process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL ?? "https://t.me",
  },
  {
    id: "youtube_subscribe",
    label: "Subscribe to our YouTube channel",
    reward: 2.0,
    platform: "youtube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL ?? "https://youtube.com",
  },
  {
    id: "youtube_like",
    label: "Like a YouTube video",
    reward: 1.0,
    platform: "youtube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_LIKE_URL ?? "https://youtube.com",
  },
  {
    id: "youtube_comment",
    label: "Comment on a YouTube video",
    reward: 1.5,
    platform: "youtube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_COMMENT_URL ?? "https://youtube.com",
  },
  {
    id: "youtube_watch",
    label: "Watch a video for 2–3 minutes",
    reward: 2.0,
    platform: "youtube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_WATCH_URL ?? "https://youtube.com",
  },
];

export function getSocialTaskById(taskId: string): SocialTask | undefined {
  return SOCIAL_TASKS.find((task) => task.id === taskId);
}

export const WITHDRAWAL_RULES = {
  minBalanceToUnlock: 700,
  retentionPercent: 30,
  minWithdrawalAmount: 100,
  /** Direct referrals who registered required before first withdrawal */
  requiredReferrals: 4,
} as const;

/** Forex trade VIP boost — daily income = base × rate + vip level */
export const FOREX_TRADE = {
  interestRate: 1.15,
  vipPackagesPath: "/dashboard/vip-packages",
} as const;

/** VIP package tiers — price & daily income (7-day cycle) */
export const VIP_TIERS = [
  { level: 1, name: "VIP 1", price: 650, dailyIncome: 23.21, durationDays: 7 },
  { level: 2, name: "VIP 2", price: 2700, dailyIncome: 96.43, durationDays: 7 },
  { level: 3, name: "VIP 3", price: 6400, dailyIncome: 228.57, durationDays: 7 },
  { level: 4, name: "VIP 4", price: 13800, dailyIncome: 492.86, durationDays: 7 },
  { level: 5, name: "VIP 5", price: 24000, dailyIncome: 857.14, durationDays: 7 },
  { level: 6, name: "VIP 6", price: 38000, dailyIncome: 1357.14, durationDays: 7 },
] as const;

/** Invitation reward when a referral buys a VIP package (15%) */
export const VIP_REFERRAL_REWARDS = [
  { level: 1, name: "VIP 1", packagePrice: 650, reward: 97.5, percent: 15 },
  { level: 2, name: "VIP 2", packagePrice: 2700, reward: 405, percent: 15 },
  { level: 3, name: "VIP 3", packagePrice: 6400, reward: 960, percent: 15 },
  { level: 4, name: "VIP 4", packagePrice: 13800, reward: 2070, percent: 15 },
  { level: 5, name: "VIP 5", packagePrice: 24000, reward: 3600, percent: 15 },
  { level: 6, name: "VIP 6", packagePrice: 38000, reward: 5700, percent: 15 },
] as const;

export const REFERRAL_COMMISSION = {
  level1: 15,
  level2: 10,
  level3: 5,
} as const;

export type DepositPaymentMethod = {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  instructions: string[];
};

export const DEPOSIT_PAYMENT_METHODS: DepositPaymentMethod[] = [
  {
    id: "telebirr",
    name: "Telebirr (Ethio Telecom)",
    bankName: "Telebirr (Ethio Telecom)",
    accountNumber: "0929025757",
    accountHolder: "Abera",
    instructions: [
      "Copy the account number above",
      "Transfer the exact VIP package amount using your bank app",
      "Take a screenshot of the payment confirmation",
      "Press the button below and fill in your details",
    ],
  },
  {
    id: "bank",
    name: "Bank Transfer",
    bankName: "Commercial Bank of Ethiopia",
    accountNumber: "Contact support for details",
    accountHolder: "Birr Tera",
    instructions: [
      "Contact support to receive bank account details",
      "Transfer the exact VIP package amount",
      "Take a screenshot of the payment confirmation",
      "Press the button below and fill in your details",
    ],
  },
];

export function getReferralRewardForLevel(vipLevel: number): number {
  return VIP_REFERRAL_REWARDS.find((r) => r.level === vipLevel)?.reward ?? 0;
}
