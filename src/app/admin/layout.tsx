"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // If it's the login page, no need to verify user session eagerly
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        const json = await res.json();
        if (json.success && json.user) {
          setCurrentUser(json.user);
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Session verification error:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, isLoginPage, router]);

  // If login page, render clean container without sidebar/header
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-forest-deep flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  // Loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
        <p className="text-sm font-serif font-bold text-forest">
          Loading FarmCare360 CMS...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-ivory text-charcoal">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={currentUser?.role}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          currentUser={currentUser}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
