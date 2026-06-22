"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateUserRole } from "@/lib/actions/admin";
import { useFeedback } from "@/components/providers/feedback-provider";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { Button } from "@/components/ui/button";
import { applyActionResult, getErrorMessage } from "@/lib/feedback";

type AdminUserActionsProps = {
  userId: string;
  role: "user" | "admin";
  isSelf: boolean;
};

export function AdminUserActions({ userId, role, isSelf }: AdminUserActionsProps) {
  const router = useRouter();
  const { showError, showSuccess } = useFeedback();
  const [pending, startTransition] = useTransition();

  function toggleRole() {
    const next = role === "admin" ? "user" : "admin";
    const msg =
      next === "admin"
        ? "Promote this user to admin?"
        : "Remove admin role from this user?";

    if (!window.confirm(msg)) return;

    startTransition(async () => {
      try {
        const result = await updateUserRole(userId, next);
        applyActionResult(result, { onError: showError, onSuccess: showSuccess });
        if (!result.error) router.refresh();
      } catch (err) {
        showError(getErrorMessage(err));
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={pending || isSelf}
        onClick={toggleRole}
      >
        {role === "admin" ? "Make user" : "Make admin"}
      </Button>
      <AdminDeleteButton
        id={userId}
        type="user"
        disabled={isSelf}
        label="Delete"
      />
    </div>
  );
}
