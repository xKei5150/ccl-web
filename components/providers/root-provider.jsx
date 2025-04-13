"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { Suspense } from "react";
import { QueryProvider } from "./query-provider";

export function RootProvider({ children }) {
  return (
    <Suspense>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </Suspense>
  );
}