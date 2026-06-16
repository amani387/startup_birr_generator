import { redirect } from "next/navigation";
import { getCurrentProfile, getPostLoginPath } from "@/lib/data/profile";

export default async function Home() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  redirect(getPostLoginPath(profile.role));
}
