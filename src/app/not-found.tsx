import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center p-4">
      <Card padding="lg" className="w-full max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you are looking for does not exist or was moved.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">Go to dashboard</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
