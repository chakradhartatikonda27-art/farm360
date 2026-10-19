"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import { CmsPage } from "@/lib/cms/types";

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      const json = await res.json();
      const list = json.data || json;
      if (Array.isArray(list)) {
        setPages(list);
      }
    } catch (err) {
      console.error("Failed to load pages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Pages & Section Blocks
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Configure every page on the FarmCare360 platform, adjust section order,
            and modify text copy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-subtle" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
            />
          </div>
        </div>
      </div>

      {/* Pages Table Card */}
      <AdminCard bodyClassName="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-forest" />
            <span>Loading pages...</span>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-8 text-center text-charcoal-muted text-sm">
            No pages found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-border bg-ivory-surface/60 text-charcoal-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-5">Page Title</th>
                  <th className="py-3.5 px-5">Slug / URL</th>
                  <th className="py-3.5 px-5">Sections</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Last Updated</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/60">
                {filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-ivory-surface/40 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="font-semibold text-charcoal flex items-center gap-2">
                        <FileText className="w-4 h-4 text-forest shrink-0" />
                        <span>{page.title}</span>
                      </div>
                      {page.seoDescription && (
                        <div className="text-xs text-charcoal-subtle mt-0.5 max-w-sm truncate">
                          {page.seoDescription}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs px-2 py-1 rounded bg-cream/50 text-forest border border-cream-border">
                        /{page.slug === "home" ? "" : page.slug}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest/5 text-forest border border-forest/15">
                        <Layers className="w-3 h-3 text-forest" />
                        <span>{page.sections?.length || 0} blocks</span>
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {page.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-xs text-charcoal-subtle">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/${page.slug === "home" ? "" : page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-forest hover:bg-cream/40 transition-colors"
                          title="View live page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link href={`/admin/pages/${page.slug}`}>
                          <AdminButton
                            variant="primary"
                            size="sm"
                            icon={<Edit className="w-3.5 h-3.5" />}
                          >
                            Edit Sections
                          </AdminButton>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
