"use client";

import { useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ReferralCopySectionProps = {
  referralCode: string;
  referralLink: string;
};

export function ReferralCopySection({
  referralCode,
  referralLink,
}: ReferralCopySectionProps) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function copy(text: string, type: "code" | "link") {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <Card glow>
        <h3 className="mb-4 font-bold">Your Referral Link</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted">Referral Code</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{referralCode}</span>
              <button
                type="button"
                onClick={() => copy(referralCode, "code")}
                className="text-muted hover:text-primary"
                aria-label="Copy referral code"
              >
                <Copy className="h-4 w-4" />
              </button>
              {copied === "code" && (
                <span className="text-xs text-green-400">Copied!</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted">Referral Link</p>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-surface-bright px-3 py-2">
              <span className="flex-1 truncate text-sm">{referralLink}</span>
              <button
                type="button"
                onClick={() => copy(referralLink, "link")}
                className="text-muted hover:text-primary"
                aria-label="Copy referral link"
              >
                <Copy className="h-4 w-4" />
              </button>
              {copied === "link" && (
                <span className="text-xs text-green-400">Copied!</span>
              )}
            </div>
          </div>
          <Button onClick={() => copy(referralLink, "link")}>
            <Share2 className="h-4 w-4" />
            Share Referral Link
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col items-center">
          <QRCodeSVG value={referralLink} size={180} bgColor="#1a1a1a" fgColor="#ffd700" />
          <Button variant="outline" className="mt-4">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </Card>
      </div>
    </>
  );
}
