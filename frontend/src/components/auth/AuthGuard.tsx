"use client";

import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token] = useState<string | null>(() => getToken());

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) {
    return <div className="p-8 text-sm font-semibold text-slate-500">Loading workspace...</div>;
  }

  return <>{children}</>;
}
