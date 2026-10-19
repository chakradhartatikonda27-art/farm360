"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  ArrowUpDown,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { FAQItem } from "@/lib/cms/types";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQItem | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/faqs");
      const json = await res.json();
      if (json.success) {
        setFaqs(json.data);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFaq = async () => {
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) return;

    try {
      setSaving(true);
      const exists = faqs.some((f) => f.id === editingFaq.id);
      const url = exists ? `/api/admin/faqs/${editingFaq.id}` : "/api/admin/faqs";
      const method = exists ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFaq),
      });

      const json = await res.json();
      if (json.success) {
        fetchFaqs();
        setEditingFaq(null);
      }
    } catch (err) {
      console.error("Failed to save FAQ:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;
    try {
      const res = await fetch(`/api/admin/faqs/${faqToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
        setDeleteModalOpen(false);
        setFaqToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
    }
  };

  const openNewFaq = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
      category: "General",
      assignedPage: "home",
      displayOrder: faqs.length + 1,
    });
  };

  const categories = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)));

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            FAQ Library & Knowledge Base
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage frequently asked questions across the homepage, services, managed
            care, and landowner partnership pages.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          onClick={openNewFaq}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Question
        </AdminButton>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-cream-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-subtle" />
          <input
            type="text"
            placeholder="Search questions or answers..."
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
            <option value="all">All Categories ({faqs.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs List */}
      <AdminCard bodyClassName="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-forest" />
            <span>Loading FAQs...</span>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-charcoal-muted text-sm">
            No questions found.
          </div>
        ) : (
          <div className="divide-y divide-cream-border/60">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="p-5 hover:bg-ivory-surface/40 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cream/70 text-forest border border-cream-border">
                      Order: {faq.displayOrder || 1}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-forest/5 text-forest border border-forest/15">
                      {faq.category}
                    </span>
                    {faq.assignedPage && (
                      <span className="text-[10px] font-mono text-charcoal-subtle">
                        Page: /{faq.assignedPage}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-bold text-charcoal">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingFaq(faq)}
                    className="p-2 rounded-lg text-charcoal-muted hover:text-forest hover:bg-cream/40 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqToDelete(faq);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Edit / Create FAQ Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-elevated border border-cream-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-cream-border/70 bg-ivory-surface">
              <h3 className="font-serif text-lg font-bold text-forest">
                {editingFaq.question ? "Edit FAQ" : "New Question"}
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, question: e.target.value })
                  }
                  placeholder="e.g. Can FarmCare360 manage land if the owner lives in the US or UK?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, answer: e.target.value })
                  }
                  placeholder="Comprehensive response explaining FarmCare360's digital reports and supervision..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Category
                  </label>
                  <select
                    value={editingFaq.category}
                    onChange={(e) =>
                      setEditingFaq({ ...editingFaq, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
                  >
                    <option value="General">General</option>
                    <option value="Agricultural Care">Agricultural Care</option>
                    <option value="Urban Terraces">Urban Terraces</option>
                    <option value="Partnerships & Leasing">Partnerships & Leasing</option>
                    <option value="Pricing & Billing">Pricing & Billing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Assigned Page
                  </label>
                  <select
                    value={editingFaq.assignedPage || "home"}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        assignedPage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
                  >
                    <option value="home">Home Page</option>
                    <option value="services">Services Page</option>
                    <option value="managed-care">Managed Care</option>
                    <option value="landowners">Landowners</option>
                    <option value="transparency">Transparency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingFaq.displayOrder || 1}
                  onChange={(e) =>
                    setEditingFaq({
                      ...editingFaq,
                      displayOrder: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-cream-border/70 bg-ivory-surface">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setEditingFaq(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="gold"
                size="sm"
                loading={saving}
                onClick={handleSaveFaq}
                icon={<Save className="w-3.5 h-3.5" />}
              >
                Save Question
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Question"
        message="Are you sure you want to delete this FAQ? It will be removed from all assigned pages."
        confirmText="Delete Question"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setFaqToDelete(null);
        }}
      />
    </div>
  );
}
