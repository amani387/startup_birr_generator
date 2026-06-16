type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
