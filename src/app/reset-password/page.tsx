import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/data/profile";

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  return (
    <AuthPageShell>
      <ResetPasswordForm isAuthenticated={Boolean(user)} />
    </AuthPageShell>
  );
}
