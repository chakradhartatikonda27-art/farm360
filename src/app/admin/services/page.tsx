"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ServiceItem } from "@/lib/cms/types";

export default function AdminServicesListPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const json = await res.json();
      if (json.success) {
        setServices(json.data);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (service: ServiceItem) => {
    try {
      const updated = { ...service, isActive: !service.isActive };
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? updated : s))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleToggleFeatured = async (service: ServiceItem) => {
    try {
      const updated = { ...service, isFeatured: !service.isFeatured };
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? updated : s))
        );
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
        setDeleteModalOpen(false);
        setServiceToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
    } finally {
      setDeleting(false);
    }
  };

  const categories = Array.from(
    new Set(services.map((s) => s.category).filter(Boolean))
  );

  const filteredServices = services
    .filter((s) => {
      const matchesSearch =
        (s.title || s.name || "").toLowerCase().includes(search.toLowerCase()) ||
        s.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
        s.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Agricultural & Space Services
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage all 15+ agricultural, residential, terrace, and specialized services
            across the FarmCare360 catalog.
          </p>
        </div>

        <Link href="/admin/services/new">
          <AdminButton
            variant="gold"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Service
          </AdminButton>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-cream-border">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-subtle" />
          <input
            type="text"
            placeholder="Search services by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-charcoal-muted shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
          >
            <option value="all">All Categories ({services.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services List Table */}
      <AdminCard bodyClassName="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-forest" />
            <span>Loading services directory...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-8 text-center text-charcoal-muted text-sm">
            No services found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-border bg-ivory-surface/60 text-charcoal-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/60">
                {filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-ivory-surface/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-xs font-semibold text-charcoal-subtle">
                        {service.displayOrder || 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cream/40 border border-cream-border overflow-hidden shrink-0 relative">
                          {service.heroImage ? (
                            <img
                              src={service.heroImage}
                              alt={service.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal-subtle">
                              <Briefcase className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-charcoal flex items-center gap-2">
                            <span>{service.title}</span>
                          </div>
                          <div className="text-xs text-charcoal-subtle font-mono mt-0.5">
                            /services/{service.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-forest/5 text-forest border border-forest/15">
                        {service.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(service)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                          service.isFeatured
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "text-charcoal-subtle hover:text-charcoal"
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            service.isFeatured
                              ? "fill-amber-500 text-amber-500"
                              : ""
                          }`}
                        />
                        <span>{service.isFeatured ? "Featured" : "Regular"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(service)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          service.isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-stone-100 text-stone-600 border border-stone-300"
                        }`}
                      >
                        {service.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-stone-500" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/services/${service.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-forest hover:bg-cream/40 transition-colors"
                          title="View live service page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link href={`/admin/services/${service.id}`}>
                          <AdminButton
                            variant="primary"
                            size="sm"
                            icon={<Edit className="w-3.5 h-3.5" />}
                          >
                            Edit
                          </AdminButton>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setServiceToDelete(service);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Delete Service Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Agricultural Service"
        message={`Are you sure you want to permanently delete "${serviceToDelete?.title}"? This will remove its public page and database record.`}
        confirmText="Delete Service"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
      />
    </div>
  );
}
