import { PageHeader } from "@/components/dashboard/page-header";
import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-forms";
import { requireProfile } from "@/lib/data/profile";

export default async function ProfilePage() {
  const profile = await requireProfile();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your account information and preferences."
      />

      <ProfileForm profile={profile} />
      <PasswordForm />
    </div>
  );
}
