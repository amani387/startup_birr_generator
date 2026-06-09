import { PageHeader } from "@/components/dashboard/page-header";
import {
  WithdrawalPrivacyNotice,
  WithdrawalSettingsForm,
} from "@/components/dashboard/withdrawal-settings-form";
import { requireProfile } from "@/lib/data/profile";
import { getWithdrawalSettings } from "@/lib/data/queries";

export default async function WithdrawalSettingsPage() {
  const profile = await requireProfile();
  const settings = await getWithdrawalSettings(profile.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdrawal Settings"
        description="Save your preferred payment method so it auto-fills on every withdrawal request."
      />

      <WithdrawalPrivacyNotice />
      <WithdrawalSettingsForm settings={settings} />
    </div>
  );
}
