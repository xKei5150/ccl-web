"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasRole } from "@/lib/utils";

export function withAuth(Component, allowedRoles = []) {
  return function ProtectedRoute(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || (allowedRoles.length > 0 && !hasRole(user, allowedRoles)))) {
        router.push("/auth/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user || (allowedRoles.length > 0 && !hasRole(user, allowedRoles))) {
      return null;
    }

    return <Component {...props} />;
  };
}