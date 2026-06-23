import { Building2 } from "lucide-react";
import { PlatformSettingsForm } from "@/components/admin/platform-settings-form";
import { Card } from "@/components/ui/card";
import { getPlatformContactSettings } from "@/lib/data/platform-settings";

export default async function AdminSettingsPage() {
  const settings = await getPlatformContactSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Platform Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Update Telebirr, CBE, and social account details shown to users.
        </p>
      </div>

      <Card className="border-primary/15 bg-primary/[0.04]">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted">
            Changes apply immediately on the deposit page and social reward tasks.
            Run migration <code className="text-xs">008_platform_contact_settings.sql</code>{" "}
            on Supabase if these fields are missing.
          </p>
        </div>
      </Card>

      <PlatformSettingsForm settings={settings} />
    </div>
  );
}
