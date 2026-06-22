"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteDeposit,
  deleteUser,
  deleteWithdrawal,
} from "@/lib/actions/admin";
import { useFeedback } from "@/components/providers/feedback-provider";
import { Button } from "@/components/ui/button";
import { applyActionResult, getErrorMessage } from "@/lib/feedback";

type AdminDeleteButtonProps = {
  id: string;
  type: "deposit" | "withdrawal" | "user";
  label?: string;
  disabled?: boolean;
};

export function AdminDeleteButton({
  id,
  type,
  label = "Delete",
  disabled,
}: AdminDeleteButtonProps) {
  const router = useRouter();
  const { showError, showSuccess } = useFeedback();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const messages = {
      deposit: "Delete this deposit record? This cannot be undone.",
      withdrawal: "Delete this withdrawal record?",
      user: "Delete this user and all their data? This cannot be undone.",
    };

    if (!window.confirm(messages[type])) return;

    startTransition(async () => {
      try {
        const result =
          type === "deposit"
            ? await deleteDeposit(id)
            : type === "withdrawal"
              ? await deleteWithdrawal(id)
              : await deleteUser(id);

        applyActionResult(result, { onError: showError, onSuccess: showSuccess });
        if (!result.error) router.refresh();
      } catch (err) {
        showError(getErrorMessage(err));
      }
    });
  }

  return (
    <Button
      size="sm"
      variant="danger"
      disabled={disabled || pending}
      onClick={handleDelete}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "Deleting..." : label}
    </Button>
  );
}
