"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { updatePassword, updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, {});

  return (
    <Card>
      <h3 className="mb-4 font-bold">Personal Information</h3>
      <form action={action} className="space-y-4">
        <FormMessage result={state} />
        <Input
          label="Full Name"
          name="full_name"
          defaultValue={profile.full_name}
          required
        />
        <Input
          label="Email"
          type="email"
          defaultValue={profile.email}
          disabled
          hint="Email cannot be changed here"
        />
        <Input
          label="Referral Code"
          defaultValue={profile.referral_code}
          disabled
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, {});

  return (
    <Card>
      <h3 className="mb-4 font-bold">Change Password</h3>
      <form action={action} className="space-y-4">
        <FormMessage result={state} />
        <PasswordInput label="New Password" name="new_password" required />
        <PasswordInput
          label="Confirm New Password"
          name="confirm_password"
          required
        />
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}
