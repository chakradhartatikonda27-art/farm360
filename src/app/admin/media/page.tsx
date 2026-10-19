"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  FileText,
  Filter,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { MediaAsset } from "@/lib/cms/types";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      const list = json.data || json;
      if (Array.isArray(list)) {
        setAssets(list);
      }
    } catch (err) {
      console.error("Failed to fetch media assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!assetToDelete) return;
    try {
      const res = await fetch(`/api/admin/media?id=${assetToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== assetToDelete.id));
        setDeleteModalOpen(false);
        setAssetToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete media:", err);
    }
  };

  const filteredAssets = assets.filter(
    (a) =>
      (a.name || a.filename || a.originalName || '')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Media & Asset Vault
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Centralized media library for high-resolution photography, diagrams, and PDF
            documents across the FarmCare360 platform.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gold text-forest-deep hover:bg-gold-hover shadow-sm transition-all">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? "Uploading files..." : "Upload New Files"}</span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-cream-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-subtle" />
          <input
            type="text"
            placeholder="Search media by filename, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
          />
        </div>

        <span className="text-xs text-charcoal-subtle">
          Total: <strong className="text-forest">{assets.length}</strong> items
        </span>
      </div>

      {/* Grid of Media Assets */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-forest" />
          <span>Loading media assets...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-12 text-center text-charcoal-muted bg-white rounded-xl border border-cream-border">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-cream-border" />
          <p className="text-sm font-medium">No assets found</p>
          <p className="text-xs text-charcoal-subtle mt-1">
            Drag and drop or upload images to populate your library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => {
            const isCopied = copiedId === asset.id;
            const isPdf = asset.mimeType?.includes("pdf");

            return (
              <div
                key={asset.id}
                className="group bg-white rounded-xl border border-cream-border overflow-hidden shadow-soft hover:shadow-md hover:border-gold/60 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full bg-cream/20 overflow-hidden flex items-center justify-center">
                  {isPdf ? (
                    <div className="text-center p-4">
                      <FileText className="w-10 h-10 mx-auto text-rose-500 mb-1" />
                      <span className="text-[10px] font-mono font-semibold text-charcoal-muted uppercase">
                        PDF
                      </span>
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.alt || asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset)}
                      title="Copy Public URL"
                      className="p-2 rounded-lg bg-white/90 text-charcoal hover:bg-gold hover:text-forest-deep transition-colors shadow-sm"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open full image"
                      className="p-2 rounded-lg bg-white/90 text-charcoal hover:bg-forest hover:text-white transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setAssetToDelete(asset);
                        setDeleteModalOpen(true);
                      }}
                      title="Delete asset"
                      className="p-2 rounded-lg bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-2.5 bg-ivory-surface border-t border-cream-border/70">
                  <p className="text-[11px] font-semibold text-charcoal truncate" title={asset.name || asset.filename}>
                    {asset.name || asset.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-charcoal-subtle mt-0.5">
                    <span>
                      {asset.size
                        ? `${Math.round(asset.size / 1024)} KB`
                        : "Asset"}
                    </span>
                    {asset.width && asset.height && (
                      <span className="font-mono">
                        {asset.width}x{asset.height}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Media Asset"
        message={`Are you sure you want to delete "${assetToDelete?.name || assetToDelete?.filename}"? Any page or service referencing this URL may display a missing image.`}
        confirmText="Delete Asset"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setAssetToDelete(null);
        }}
      />
    </div>
  );
}
