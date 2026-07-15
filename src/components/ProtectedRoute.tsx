import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold">Access denied</p>
        <p className="text-muted-foreground">
          {user.email} isn't authorized for admin access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
