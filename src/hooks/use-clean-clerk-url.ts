"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useCleanClerkUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasClerkParams =
      searchParams.has("__clerk_handshake") ||
      searchParams.has("__clerk_db_jwt");

    if (hasClerkParams) {
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [router, searchParams]);
}
