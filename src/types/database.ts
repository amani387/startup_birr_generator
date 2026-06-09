export type Profile = {
  id: string;
  full_name: string;
  email: string;
  referral_code: string;
  referred_by: string | null;
  role: "user" | "admin";
  balance: number;
  total_earned: number;
  total_deposited: number;
  total_withdrawn: number;
  vip_level: number;
  daily_streak: number;
  last_daily_claim: string | null;
  created_at: string;
  updated_at: string;
};

export type VipPlan = {
  id: string;
  level: number;
  name: string;
  price: number;
  daily_income: number;
  duration_days: number;
  total_return: number;
  active: boolean;
};

export type VipPurchase = {
  id: string;
  user_id: string;
  plan_id: string;
  amount_paid: number;
  daily_income: number;
  started_at: string;
  expires_at: string;
  days_claimed: number;
  status: "active" | "completed" | "cancelled";
  vip_plans?: VipPlan;
};

export type Deposit = {
  id: string;
  amount: number;
  payment_method: string;
  screenshot_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type Withdrawal = {
  id: string;
  amount: number;
  payment_method: string;
  account_holder: string;
  account_number: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type WithdrawalSettings = {
  payment_method: string;
  account_holder: string;
  account_number: string;
};

export type Earning = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
};

export type ReferralMember = {
  id: string;
  full_name: string;
  email: string;
  vip_level: number;
  created_at: string;
};

export type ActivityItem = {
  id: string;
  type: "deposit" | "withdrawal" | "earning" | "referral";
  label: string;
  amount: number;
  status?: string;
  created_at: string;
};

export type ActionResult = {
  error?: string;
  success?: string;
};
