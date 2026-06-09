import { redirect } from "next/navigation";

type RefPageProps = {
  params: Promise<{ code: string }>;
};

export default async function RefPage({ params }: RefPageProps) {
  const { code } = await params;
  redirect(`/register?ref=${encodeURIComponent(code)}`);
}
