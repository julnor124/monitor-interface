import type { ReactNode } from "react";
// Wraps the app with required context providers.

export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
