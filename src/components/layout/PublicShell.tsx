"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { FloatingWhatsApp } from "../common/FloatingWhatsApp";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isLaunchRoute = pathname?.startsWith("/launch");

  if (isAdminRoute || isLaunchRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 w-full">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}
