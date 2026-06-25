import {
  type DepositPaymentMethod,
  type SocialTask,
  SOCIAL_TASK_TEMPLATES,
} from "@/lib/constants";

export type PlatformContactSettings = {
  telebirr_phone: string;
  telebirr_account_holder: string;
  cbe_account_number: string;
  cbe_account_holder: string;
  youtube_channel_url: string;
  telegram_group_url: string;
  telegram_channel_url: string;
  twitter_url: string;
  facebook_page_url: string;
};

export const DEFAULT_PLATFORM_CONTACT: PlatformContactSettings = {
  telebirr_phone: "0929025757",
  telebirr_account_holder: "Abera",
  cbe_account_number: "Contact support for details",
  cbe_account_holder: "GoGenzeb",
  youtube_channel_url: "https://youtube.com",
  telegram_group_url: "https://t.me",
  telegram_channel_url: "https://t.me",
  twitter_url: "https://x.com",
  facebook_page_url: "https://facebook.com",
};

export const PLATFORM_CONTACT_KEYS = Object.keys(
  DEFAULT_PLATFORM_CONTACT
) as (keyof PlatformContactSettings)[];

const SOCIAL_TASK_HREF_KEY: Record<string, keyof PlatformContactSettings> = {
  facebook_follow: "facebook_page_url",
  facebook_share: "facebook_page_url",
  telegram_invite: "telegram_group_url",
  telegram_join: "telegram_channel_url",
  youtube_subscribe: "youtube_channel_url",
  youtube_watch: "youtube_channel_url",
};

export function buildDepositPaymentMethods(
  settings: PlatformContactSettings
): DepositPaymentMethod[] {
  return [
    {
      id: "telebirr",
      name: "Telebirr (Ethio Telecom)",
      bankName: "Telebirr (Ethio Telecom)",
      accountNumber: settings.telebirr_phone,
      accountHolder: settings.telebirr_account_holder,
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
      accountNumber: settings.cbe_account_number,
      accountHolder: settings.cbe_account_holder,
      instructions: [
        "Copy the CBE account number above",
        "Transfer the exact VIP package amount",
        "Take a screenshot of the payment confirmation",
        "Press the button below and fill in your details",
      ],
    },
  ];
}

export function buildSocialTasks(
  settings: PlatformContactSettings
): SocialTask[] {
  return SOCIAL_TASK_TEMPLATES.map((task) => {
    const settingsKey = SOCIAL_TASK_HREF_KEY[task.id];
    const href = settingsKey ? settings[settingsKey] : settings.facebook_page_url;
    return { ...task, href };
  });
}
