"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Check, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import AdminButton from "./AdminButton";
import { MediaAsset } from "@/lib/cms/types";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, asset?: MediaAsset) => void;
  currentValue?: string;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentValue = "",
  title = "Select Image Asset",
}: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(currentValue);

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentValue);
      fetchMedia();
    }
  }, [isOpen, currentValue]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      if (json.success) {
        setAssets(json.data);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uploads");

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAssets((prev) => [json.data, ...prev]);
        setSelectedUrl(json.data.url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const filteredAssets = assets.filter((asset) =>
    (asset.name || asset.filename || asset.originalName || '')
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    asset.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-elevated border border-cream-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-border/70 bg-ivory-surface">
          <div>
            <h3 className="font-serif text-lg font-bold text-forest">{title}</h3>
            <p className="text-xs text-charcoal-muted">
              Choose from existing uploaded assets or upload a new file.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-cream/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-cream-border/50 bg-cream/10">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-subtle" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forest text-ivory hover:bg-forest-light transition-colors">
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{uploading ? "Uploading..." : "Upload New File"}</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Grid content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-forest" />
              <span>Loading media assets...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-16 text-charcoal-muted">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 text-cream-border" />
              <p className="text-sm font-medium">No assets found</p>
              <p className="text-xs text-charcoal-subtle mt-1">
                Upload images to populate the media library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredAssets.map((asset) => {
                const isSelected = selectedUrl === asset.url;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedUrl(asset.url)}
                    className={`group relative rounded-xl border-2 overflow-hidden aspect-square bg-cream/20 text-left transition-all ${
                      isSelected
                        ? "border-gold ring-2 ring-gold/30 shadow-md"
                        : "border-cream-border hover:border-forest/40"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      {/* Thumbnail */}
                      <img
                        src={asset.url}
                        alt={asset.alt || asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback placeholder if missing
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold text-forest-deep flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                        <p className="text-[10px] font-medium truncate">
                          {asset.name || asset.filename}
                        </p>
                        <p className="text-[9px] text-ivory/70">
                          {asset.mimeType?.split("/")[1]?.toUpperCase() || "IMG"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between p-4 border-t border-cream-border/70 bg-ivory-surface">
          <div className="text-xs text-charcoal-muted truncate max-w-xs">
            {selectedUrl ? (
              <span className="font-mono text-[11px] text-forest font-semibold">
                Selected: {selectedUrl.split("/").pop()}
              </span>
            ) : (
              <span>No image selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AdminButton variant="outline" size="sm" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton
              variant="gold"
              size="sm"
              disabled={!selectedUrl}
              onClick={() => {
                const found = assets.find((a) => a.url === selectedUrl);
                onSelect(selectedUrl, found);
                onClose();
              }}
            >
              Select Image
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
