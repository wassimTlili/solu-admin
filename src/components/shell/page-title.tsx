"use client";

import { usePathname } from "next/navigation";
import { titleFor } from "./nav";

export function PageTitle() {
  return <h1 className="text-base font-semibold">{titleFor(usePathname())}</h1>;
}
