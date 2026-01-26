import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Outlet } from "react-router-dom";
import SignIn from "components/SignIn";
import { Loader2 } from "lucide-react";
import { useGetUser } from "features/admin/hooks/users/useGetUser";
import { AdminAuthContext } from "../../../types/AdminAuthContext";

export default function AdminAuth() {
  const userResponse = useGetUser();

  return (
    // 1. Main Container: Deep dark background
    <div className="relative min-h-screen w-full bg-zinc-950 text-white overflow-hidden selection:bg-emerald-500/30">

      {/* 2. Background Effects (Fixed position to stay while scrolling) */}
      <div className="pointer-events-none fixed inset-0 z-0">

        {/* Deep Emerald Glow - Bottom Right */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-700 rounded-full blur-3xl" />
        </div>
      </div>
      {/* 3. Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">

        <AuthLoading>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-medium animate-pulse">Verificando credenciales...</p>
            </div>
          </div>
        </AuthLoading>

        <Unauthenticated>
          <SignIn />
        </Unauthenticated>

        <Authenticated>
          <Outlet context={{ userResponse } satisfies AdminAuthContext} />
        </Authenticated>

      </div>
    </div>
  );
}