"use client";

import { useActionState } from "react";
import { Building2, Share2, Smartphone } from "lucide-react";
import { updatePlatformContactSettings } from "@/lib/actions/settings";
import type { PlatformContactSettings } from "@/lib/platform-contact";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PlatformSettingsFormProps = {
  settings: PlatformContactSettings;
};

export function PlatformSettingsForm({ settings }: PlatformSettingsFormProps) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string; success?: string }, formData: FormData) =>
      updatePlatformContactSettings(formData),
    {}
  );

  return (
    <form action={action} className="space-y-6">
      <FormMessage result={state} />

      <Card>
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold">Payment accounts</h2>
            <p className="text-sm text-muted">
              Shown on the deposit page when users pay via Telebirr or CBE.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Telebirr phone number"
            name="telebirr_phone"
            defaultValue={settings.telebirr_phone}
            placeholder="09xxxxxxxx"
            required
          />
          <Input
            label="Telebirr account holder"
            name="telebirr_account_holder"
            defaultValue={settings.telebirr_account_holder}
            required
          />
          <Input
            label="CBE account number"
            name="cbe_account_number"
            defaultValue={settings.cbe_account_number}
            required
          />
          <Input
            label="CBE account holder"
            name="cbe_account_holder"
            defaultValue={settings.cbe_account_holder}
            required
          />
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold">Social accounts</h2>
            <p className="text-sm text-muted">
              Used for social reward task links on the dashboard.
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          <Input
            label="YouTube channel URL"
            name="youtube_channel_url"
            type="url"
            defaultValue={settings.youtube_channel_url}
            placeholder="https://youtube.com/@channel"
            required
          />
          <Input
            label="Telegram group URL"
            name="telegram_group_url"
            type="url"
            defaultValue={settings.telegram_group_url}
            placeholder="https://t.me/yourgroup"
            required
          />
          <Input
            label="Telegram channel URL"
            name="telegram_channel_url"
            type="url"
            defaultValue={settings.telegram_channel_url}
            placeholder="https://t.me/yourchannel"
            required
          />
          <Input
            label="Twitter / X profile URL"
            name="twitter_url"
            type="url"
            defaultValue={settings.twitter_url}
            placeholder="https://x.com/youraccount"
            required
          />
          <Input
            label="Facebook page URL"
            name="facebook_page_url"
            type="url"
            defaultValue={settings.facebook_page_url}
            placeholder="https://facebook.com/yourpage"
            required
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
