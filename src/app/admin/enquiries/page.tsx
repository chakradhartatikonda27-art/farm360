"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  Send,
  Eye,
  Trash2,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ContactEnquiry } from "@/lib/cms/types";

export default function AdminEnquiriesCRMPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  // Note addition
  const [noteText, setNoteText] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<ContactEnquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/enquiries");
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus as any });
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const addStaffNote = async () => {
    if (!selectedEnquiry || !noteText.trim()) return;
    try {
      setUpdating(true);
      const newNote = {
        id: `note-${Date.now()}`,
        author: "Admin Staff",
        text: noteText.trim(),
        createdAt: new Date().toISOString(),
      };
      const updatedNotes = [...(selectedEnquiry.notes || []), newNote];

      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: updatedNotes }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedEnquiry({ ...selectedEnquiry, notes: updatedNotes });
        setEnquiries((prev) =>
          prev.map((e) =>
            e.id === selectedEnquiry.id ? { ...e, notes: updatedNotes } : e
          )
        );
        setNoteText("");
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryToDelete.id));
        if (selectedEnquiry?.id === enquiryToDelete.id) {
          setSelectedEnquiry(null);
        }
        setDeleteModalOpen(false);
        setEnquiryToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  const exportCSV = () => {
    window.open("/api/admin/enquiries?export=csv", "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "in_progress":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "contacted":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "resolved":
        return "bg-stone-100 text-stone-700 border-stone-300";
      case "spam":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-stone-100 text-stone-700 border-stone-300";
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.phone?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) ||
      e.serviceInterest?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Landowner Enquiries & CRM
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Track consultation requests, manage pipeline stages, add internal agronomy
            notes, and export lead sheets.
          </p>
        </div>

        <AdminButton
          variant="outline"
          size="md"
          onClick={exportCSV}
          icon={<Download className="w-4 h-4 text-forest" />}
        >
          Export CSV
        </AdminButton>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-cream-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-subtle" />
          <input
            type="text"
            placeholder="Search leads by name, phone, email, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-charcoal-muted shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
          >
            <option value="all">All Statuses ({enquiries.length})</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {/* Table & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries Table */}
        <AdminCard
          bodyClassName="p-0"
          className={selectedEnquiry ? "lg:col-span-2" : "lg:col-span-3"}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-forest" />
              <span>Loading consultation enquiries...</span>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-8 text-center text-charcoal-muted text-sm">
              No enquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-border bg-ivory-surface/60 text-charcoal-muted uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Landowner</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Land Size</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/60">
                  {filteredEnquiries.map((enq) => {
                    const isSelected = selectedEnquiry?.id === enq.id;
                    return (
                      <tr
                        key={enq.id}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-gold/10 font-medium"
                            : "hover:bg-ivory-surface/50"
                        }`}
                        onClick={() => setSelectedEnquiry(enq)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-charcoal">
                            {enq.name}
                          </div>
                          <div className="text-[11px] text-charcoal-subtle">
                            {enq.phone || enq.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-forest font-semibold">
                          {enq.serviceInterest || "General"}
                        </td>
                        <td className="py-3.5 px-4 text-charcoal-muted">
                          {enq.landSize || "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                              enq.status
                            )}`}
                          >
                            {enq.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-charcoal-subtle">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedEnquiry(enq)}
                              className="p-1 rounded text-charcoal-muted hover:text-forest hover:bg-cream/40"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEnquiryToDelete(enq);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50"
                              title="Delete enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        {/* Lead Detail & Notes Drawer */}
        {selectedEnquiry && (
          <div className="lg:col-span-1 space-y-4">
            <AdminCard
              title="Enquiry Details"
              subtitle={`Submitted on ${new Date(
                selectedEnquiry.createdAt
              ).toLocaleString()}`}
              actions={
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-xs text-charcoal-muted hover:text-charcoal"
                >
                  &times; Close
                </button>
              }
            >
              <div className="space-y-4 text-xs">
                {/* Landowner Info */}
                <div className="space-y-2 p-3 rounded-lg bg-ivory-surface border border-cream-border">
                  <div className="font-bold text-charcoal text-sm">
                    {selectedEnquiry.name}
                  </div>
                  {selectedEnquiry.phone && (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="flex items-center gap-2 text-forest hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedEnquiry.phone}</span>
                    </a>
                  )}
                  {selectedEnquiry.email && (
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="flex items-center gap-2 text-forest hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedEnquiry.email}</span>
                    </a>
                  )}
                  {selectedEnquiry.location && (
                    <div className="flex items-center gap-2 text-charcoal-muted">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedEnquiry.location}</span>
                    </div>
                  )}
                </div>

                {/* Property & Request */}
                <div className="space-y-1.5">
                  <span className="font-bold text-charcoal block">
                    Service Requested:
                  </span>
                  <div className="p-2 rounded bg-cream/30 text-forest font-semibold">
                    {selectedEnquiry.serviceInterest || "General Farm Consultation"}
                  </div>
                  <div className="text-charcoal-muted pt-1">
                    <strong>Land Size:</strong> {selectedEnquiry.landSize || "Not specified"}
                  </div>
                  {selectedEnquiry.message && (
                    <div className="pt-2">
                      <strong className="block text-charcoal mb-1">
                        Client Message:
                      </strong>
                      <p className="p-2.5 rounded bg-cream/20 text-charcoal italic border border-cream-border">
                        "{selectedEnquiry.message}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Updater */}
                <div className="pt-3 border-t border-cream-border">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1.5">
                    Update Pipeline Status
                  </label>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      updateStatus(selectedEnquiry.id, e.target.value)
                    }
                    disabled={updating}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-border bg-white font-medium focus:outline-none focus:border-forest"
                  >
                    <option value="new">New (Needs Outreach)</option>
                    <option value="in_progress">In Progress (Agronomist Assigned)</option>
                    <option value="contacted">Contacted / Call Scheduled</option>
                    <option value="resolved">Resolved / Client Onboarded</option>
                    <option value="spam">Mark as Spam</option>
                  </select>
                </div>

                {/* Internal Agronomy / Staff Notes */}
                <div className="pt-3 border-t border-cream-border space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                    Internal Staff Notes ({selectedEnquiry.notes?.length || 0})
                  </label>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                      selectedEnquiry.notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded bg-stone-50 border border-stone-200 text-[11px]"
                        >
                          <div className="flex items-center justify-between text-charcoal-subtle font-mono text-[9px]">
                            <span>{n.author}</span>
                            <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-charcoal mt-1">{n.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-charcoal-subtle text-[11px] italic">
                        No internal notes recorded yet.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addStaffNote())
                      }
                      placeholder="Add note..."
                      className="flex-1 px-2.5 py-1.5 text-xs rounded border border-cream-border focus:outline-none focus:border-forest"
                    />
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={addStaffNote}
                      disabled={!noteText.trim()}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </AdminButton>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Enquiry"
        message={`Are you sure you want to remove the enquiry from "${enquiryToDelete?.name}"?`}
        confirmText="Delete Record"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setEnquiryToDelete(null);
        }}
      />
    </div>
  );
}
