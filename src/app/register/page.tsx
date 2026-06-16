import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";

type RegisterPageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  return (
    <AuthPageShell>
      <RegisterForm defaultReferralCode={params.ref} />
    </AuthPageShell>
  );
}
