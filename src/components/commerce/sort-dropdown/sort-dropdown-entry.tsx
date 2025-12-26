"use client";

import { usePathname } from "next/navigation";
import { SortDropdown } from "./sort-dropdown";

export function SortDropdownEntry() {
  const pathname = usePathname();

  return <SortDropdown key={pathname} />
}
