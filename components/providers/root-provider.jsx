"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { Suspense } from "react";

export function RootProvider({ children }) {
  return (
    <Suspense>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Suspense>
  );
}