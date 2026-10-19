"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import { NavigationItem } from "@/lib/cms/types";

export default function AdminNavigationPage() {
  const [headerMenu, setHeaderMenu] = useState<NavigationItem[]>([]);
  const [footerMenu, setFooterMenu] = useState<NavigationItem[]>([]);
  const [announcement, setAnnouncement] = useState({
    enabled: true,
    text: "Empowering Landowners Across India: Professional Turnkey Farm Management & Agri-Living Solutions",
    link: "/contact",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/navigation");
      const json = await res.json();
      const data = json.data || json;
      if (data) {
        setHeaderMenu(data.header || []);
        setFooterMenu(data.footer || []);
        if (data.announcement) {
          setAnnouncement(data.announcement);
        }
      }
    } catch (err) {
      console.error("Failed to load navigation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          header: headerMenu,
          footer: footerMenu,
          announcement,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Navigation menus and announcement bar updated!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(json.error || "Failed to save navigation.");
      }
    } catch (err) {
      setErrorMsg("Network error saving navigation.");
    } finally {
      setSaving(false);
    }
  };

  const addHeaderLink = () => {
    setHeaderMenu([
      ...headerMenu,
      {
        id: `nav-${Date.now()}`,
        label: "New Link",
        href: "/",
        order: headerMenu.length + 1,
        isExternal: false,
      },
    ]);
  };

  const removeHeaderLink = (identifier: string | number) => {
    setHeaderMenu(headerMenu.filter((item, idx) => (item.id ? item.id !== identifier : idx !== identifier)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-forest" />
        <span>Loading navigation menus...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Menus, Announcement Bar & Navigation
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Configure header links, dropdown navigation items, top ticker announcements,
            and footer menu sections.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSaveAll}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </AdminButton>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Announcement Bar */}
      <AdminCard
        title="Top Header Announcement Ticker"
        subtitle="Displays at the very top of all website pages"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="announcement-toggle"
              checked={announcement.enabled}
              onChange={(e) =>
                setAnnouncement({ ...announcement, enabled: e.target.checked })
              }
              className="rounded text-forest focus:ring-forest"
            />
            <label
              htmlFor="announcement-toggle"
              className="text-xs font-bold text-charcoal cursor-pointer"
            >
              Enable Top Announcement Banner
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={announcement.text}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, text: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Link URL
              </label>
              <input
                type="text"
                value={announcement.link}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, link: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border font-mono focus:outline-none focus:border-forest"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Main Header Links */}
      <AdminCard
        title="Primary Header Navigation Links"
        subtitle="Manage the links displayed in the top navbar"
        actions={
          <AdminButton
            variant="outline"
            size="sm"
            onClick={addHeaderLink}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Nav Link
          </AdminButton>
        }
      >
        <div className="space-y-3">
          {headerMenu.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 rounded-lg border border-cream-border bg-ivory-surface/40 flex flex-col sm:flex-row items-center gap-3 text-xs"
            >
              <div className="w-6 text-center font-mono font-bold text-charcoal-subtle">
                #{idx + 1}
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const newMenu = [...headerMenu];
                    newMenu[idx].label = e.target.value;
                    setHeaderMenu(newMenu);
                  }}
                  placeholder="Nav Label (e.g. Services)"
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-cream-border bg-white focus:outline-none focus:border-forest"
                />
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const newMenu = [...headerMenu];
                    newMenu[idx].href = e.target.value;
                    setHeaderMenu(newMenu);
                  }}
                  placeholder="Destination URL (e.g. /services)"
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-cream-border bg-white font-mono focus:outline-none focus:border-forest"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isExternal}
                    onChange={(e) => {
                      const newMenu = [...headerMenu];
                      newMenu[idx].isExternal = e.target.checked;
                      setHeaderMenu(newMenu);
                    }}
                    className="rounded text-forest"
                  />
                  <span className="text-[11px] text-charcoal-muted">External</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeHeaderLink(item.id ?? idx)}
                  className="p-1 rounded text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-border">
        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSaveAll}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </AdminButton>
      </div>
    </div>
  );
}
