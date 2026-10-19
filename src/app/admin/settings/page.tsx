"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Share2,
  Shield,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { GlobalSettings } from "@/lib/cms/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings(json.data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Global brand & contact settings updated successfully!");
        setSettings(json.data);
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        setErrorMsg(json.error || "Failed to save settings.");
      }
    } catch (err) {
      setErrorMsg("Network error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-forest" />
        <span>Loading global platform settings...</span>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Global Settings & Contact Configurations
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage site-wide brand information, phone numbers, WhatsApp links, office
            locations, and SEO defaults.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSave}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Settings
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

      {/* Brand Identity */}
      <AdminCard title="Brand Identity & Metadata">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Site Brand Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              value={settings.siteTagline}
              onChange={(e) =>
                setSettings({ ...settings, siteTagline: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Default Meta SEO Description
            </label>
            <textarea
              rows={2}
              value={settings.seoDefaultDescription || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoDefaultDescription: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>
        </div>
      </AdminCard>

      {/* Direct Contact Information */}
      <AdminCard
        title="Official Contact Coordinates"
        subtitle="Used in the site header, footer, contact page, and floating contact widgets"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-forest" />
              <span>Official Phone Number</span>
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) =>
                setSettings({ ...settings, contactPhone: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-forest" />
              <span>Support Email Address</span>
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) =>
                setSettings({ ...settings, contactEmail: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Direct Number (E.g. +91 98765 43210)</span>
            </label>
            <input
              type="text"
              value={settings.contactWhatsapp || ""}
              onChange={(e) =>
                setSettings({ ...settings, contactWhatsapp: e.target.value })
              }
              placeholder="+91..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-forest" />
              <span>Operating Hours</span>
            </label>
            <input
              type="text"
              value={settings.operatingHours || "Monday - Saturday, 8:00 AM - 7:00 PM IST"}
              onChange={(e) =>
                setSettings({ ...settings, operatingHours: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-forest" />
              <span>Physical Headquarters / Office Address</span>
            </label>
            <textarea
              rows={2}
              value={settings.officeAddress}
              onChange={(e) =>
                setSettings({ ...settings, officeAddress: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>
        </div>
      </AdminCard>

      {/* Social Media Links */}
      <AdminCard title="Social Media Channels">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              WhatsApp Link
            </label>
            <input
              type="text"
              value={settings.socialLinks?.whatsapp || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    whatsapp: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              LinkedIn Page URL
            </label>
            <input
              type="text"
              value={settings.socialLinks?.linkedin || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    linkedin: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={settings.socialLinks?.instagram || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    instagram: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              YouTube Channel URL
            </label>
            <input
              type="text"
              value={settings.socialLinks?.youtube || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    youtube: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>
        </div>
      </AdminCard>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-border">
        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSave}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Settings
        </AdminButton>
      </div>
    </div>
  );
}
