"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  AlertCircle,
  Save,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  XCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  DollarSign,
  FileText,
  UserCheck,
  Send,
  Building,
} from "lucide-react";
import {
  LeadItem,
  SalesStage,
  LeadStatus,
  DecisionMaker,
  PaymentRecord,
} from "@/lib/cms/types";

const STAGES: { key: SalesStage; title: string; step: number }[] = [
  { key: "prospecting", title: "Prospecting", step: 1 },
  { key: "qualification", title: "Qualification", step: 2 },
  { key: "need_analysis", title: "Need Analysis", step: 3 },
  { key: "value_proposition", title: "Value Proposition", step: 4 },
  { key: "decision_makers", title: "Decision Makers", step: 5 },
  { key: "negotiation", title: "Negotiation & Payment", step: 6 },
  { key: "closed_won", title: "Closed Won", step: 7 },
];

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [lead, setLead] = useState<LeadItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  // Quick activity log state
  const [activityType, setActivityType] = useState<string>("phone_call");
  const [activityNote, setActivityNote] = useState<string>("");
  const [loggingActivity, setLoggingActivity] = useState(false);

  // Close as lost state
  const [lossReason, setLossReason] = useState<string>("budget_limitations");
  const [lossNotes, setLossNotes] = useState<string>("");
  const [closingLost, setClosingLost] = useState(false);

  // Reopen state
  const [reopenReason, setReopenReason] = useState<string>("Customer requested reconsideration");
  const [reopening, setReopening] = useState(false);

  // Conversion state
  const [converting, setConverting] = useState(false);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/leads/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setLead(data.data);
        const stageIdx = STAGES.findIndex((s) => s.key === data.data.currentStage);
        if (stageIdx >= 0) {
          setActiveStepTab(stageIdx + 1);
        } else {
          setActiveStepTab(1);
        }
      } else {
        setToastError(data.error || "Lead not found");
      }
    } catch (err: any) {
      setToastError(err.message || "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const showError = (err: string) => {
    setToastError(err);
    setTimeout(() => setToastError(null), 5000);
  };

  // Save current step data
  const handleSaveStepData = async (advanceToNext = false) => {
    if (!lead) return;
    setSaving(true);
    setToastError(null);

    try {
      const currentStageKey = STAGES[activeStepTab - 1].key;
      let targetStageKey = currentStageKey;

      if (advanceToNext && activeStepTab < 7) {
        targetStageKey = STAGES[activeStepTab].key;
      }

      // Collect data of active step
      let stageData: any = {};
      if (activeStepTab === 1) stageData = lead.stageProspecting || {};
      if (activeStepTab === 2) stageData = lead.stageQualification || {};
      if (activeStepTab === 3) stageData = lead.stageNeedAnalysis || {};
      if (activeStepTab === 4) stageData = lead.stageValueProposition || {};
      if (activeStepTab === 5) stageData = lead.stageDecisionMakers || {};
      if (activeStepTab === 6) stageData = lead.stageNegotiation || {};
      if (activeStepTab === 7) stageData = lead.stageClosedWon || {};

      const res = await fetch(`/api/admin/leads/${lead.id}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetStage: targetStageKey,
          stageData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save stage");
      }

      setLead(data.data);
      if (advanceToNext && activeStepTab < 7) {
        setActiveStepTab((prev) => prev + 1);
        showToast(`Moved forward to Step ${activeStepTab + 1}: ${STAGES[activeStepTab].title}`);
      } else {
        showToast("Changes saved successfully");
      }
    } catch (err: any) {
      showError(err.message || "Could not save stage details");
    } finally {
      setSaving(false);
    }
  };

  // Convert Lead to Project (Closed Won)
  const handleConvertToProject = async () => {
    if (!lead) return;
    if (!confirm(`Convert Deal ${lead.referenceId} (${lead.name}) into an Active Project?`)) return;

    setConverting(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${lead.name} — ${lead.serviceCategory || "Agricultural Care"}`,
          totalContractValue:
            lead.stageNegotiation?.finalAgreedAmount ||
            lead.stageValueProposition?.finalQuotedAmount ||
            lead.estimatedDealValue ||
            0,
          amountReceived: lead.stageNegotiation?.totalReceived || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to convert project");

      showToast(`Success! Project ${data.project?.referenceId} created.`);
      setLead(data.lead);
      setActiveStepTab(7);
    } catch (err: any) {
      showError(err.message || "Failed to convert lead to project");
    } finally {
      setConverting(false);
    }
  };

  // Log Activity
  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !activityNote.trim()) return;

    setLoggingActivity(true);
    try {
      const titles: Record<string, string> = {
        phone_call: "Phone Call Logged",
        whatsapp_sent: "WhatsApp Update Sent",
        email_sent: "Email Communication Sent",
        site_visit: "Site Inspection Conducted",
        meeting_held: "Client Discussion Held",
        note_added: "Internal Note Added",
      };

      const res = await fetch(`/api/admin/leads/${lead.id}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activityType,
          title: titles[activityType] || "Activity Logged",
          description: activityNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log activity");

      setActivityNote("");
      setLead(data.lead);
      showToast("Activity recorded in paper trail");
    } catch (err: any) {
      showError(err.message || "Could not log activity");
    } finally {
      setLoggingActivity(false);
    }
  };

  // Close as lost
  const handleCloseAsLost = async () => {
    if (!lead) return;
    if (!confirm(`Are you sure you want to mark enquiry ${lead.referenceId} as Closed Lost?`)) return;

    setClosingLost(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetStage: "closed_lost",
          lossReason,
          lossNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to mark as lost");

      setLead(data.data);
      showToast("Enquiry marked as Closed Lost");
    } catch (err: any) {
      showError(err.message || "Could not close as lost");
    } finally {
      setClosingLost(false);
    }
  };

  // Reopen deal
  const handleReopenDeal = async () => {
    if (!lead) return;
    setReopening(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetStage: "prospecting",
          reopenReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reopen deal");

      setLead(data.data);
      setActiveStepTab(1);
      showToast("Deal reopened to Prospecting stage");
    } catch (err: any) {
      showError(err.message || "Could not reopen deal");
    } finally {
      setReopening(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-[#7C887E]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1B3B2B] mb-3" />
        <p className="text-sm">Loading lead journey...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#1B3B2B]">Lead not found</h2>
        <p className="text-xs text-[#7C887E] mt-1">
          This enquiry may have been removed or does not exist.
        </p>
        <Link
          href="/admin/leads"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#1B3B2B] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Lead Desk
        </Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === lead.currentStage);
  const currentStepNumber = currentStageIndex >= 0 ? currentStageIndex + 1 : 1;
  const isLost = lead.status === "closed_lost" || lead.currentStage === "closed_lost";
  const cleanPhone = lead.phone.replace(/[^\d]/g, "");

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#1B3B2B] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C5A869]" />
          <span>{toastMessage}</span>
        </div>
      )}
      {toastError && (
        <div className="fixed top-4 right-4 z-50 bg-rose-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-white" />
          <span>{toastError}</span>
        </div>
      )}

      {/* Top Back Nav & Quick Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A5D4E] hover:text-[#1B3B2B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All leads
        </Link>

        {isLost && (
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Closed Lost: {lead.stageClosedLost?.lossReason?.replace(/_/g, " ")}
          </div>
        )}
      </div>

      {/* Lead Identity Summary Card */}
      <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7C887E]">
              <span>{lead.referenceId}</span>
              <span>•</span>
              <span className="uppercase text-[10px] font-sans px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#E6E1D8]">
                {lead.source}
              </span>
              <span>•</span>
              <span className="text-[11px] font-sans">
                Received {new Date(lead.createdAt).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1.5">
              <h1 className="text-2xl font-serif font-bold text-[#1B3B2B]">
                {lead.name}
              </h1>
              <span className="text-xs text-[#4A5D4E]">
                {lead.phone} {lead.location ? `• ${lead.location}` : ""}
              </span>
            </div>

            <div className="text-xs text-[#7C887E] mt-1 flex items-center gap-2">
              <span className="font-medium text-[#1B3B2B]">
                {lead.serviceCategory || "General Agricultural Planning"}
              </span>
              {lead.estimatedDealValue ? (
                <>
                  <span>•</span>
                  <span className="font-semibold text-emerald-800">
                    Est. ₹{lead.estimatedDealValue.toLocaleString("en-IN")}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {/* Quick Communication & Status */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
              title="Call customer"
            >
              <Phone className="w-3.5 h-3.5 text-[#1B3B2B]" />
              Call
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                lead.name
              )},%20this%20is%20FarmCare%20360°%20regarding%20your%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              title="WhatsApp chat"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              WhatsApp
            </a>

            {lead.email && (
              <a
                href={`mailto:${lead.email}?subject=FarmCare%20360°%20Enquiry%20${lead.referenceId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
                title="Send email"
              >
                <Mail className="w-3.5 h-3.5 text-[#8C7A5B]" />
                Email
              </a>
            )}

            <div className="pl-2 border-l border-[#E6E1D8] flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#1B3B2B] px-2.5 py-1 rounded-full bg-[#1B3B2B]/5 border border-[#1B3B2B]/10">
                Step {currentStepNumber} of 7 · {STAGES[currentStepNumber - 1]?.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Connected 7-Step Stepper Ribbon */}
      <div className="bg-white rounded-2xl border border-[#E6E1D8] p-4 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[11px] font-semibold text-[#7C887E] uppercase tracking-wider">
            LEAD JOURNEY • ONE CLEAR STEP AT A TIME
          </div>
          <div className="text-xs font-medium text-[#1B3B2B]">
            Viewing: <span className="font-bold">{STAGES[activeStepTab - 1]?.title}</span>
          </div>
        </div>

        <div className="flex items-center justify-between min-w-[700px] relative px-4 py-2">
          {/* Connector Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#E6E1D8] z-0" />

          {STAGES.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStepNumber || lead.status === "closed_won";
            const isCurrent = stepNum === currentStepNumber && !isLost;
            const isSelected = activeStepTab === stepNum;

            let circleClass = "bg-white border-2 border-[#DCD5C5] text-[#7C887E]";
            if (isCompleted) {
              circleClass = "bg-emerald-700 border-2 border-emerald-700 text-white shadow-sm";
            } else if (isCurrent) {
              circleClass = "bg-[#C5A869] border-2 border-[#C5A869] text-white shadow-md ring-4 ring-[#C5A869]/20";
            }

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveStepTab(stepNum)}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${circleClass} ${
                    isSelected ? "scale-110 ring-2 ring-[#1B3B2B]" : ""
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`text-[11px] font-medium mt-1.5 whitespace-nowrap transition-colors ${
                    isSelected
                      ? "text-[#1B3B2B] font-bold"
                      : isCompleted
                      ? "text-emerald-800 font-semibold"
                      : "text-[#7C887E]"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Stage Form + Right Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dedicated Step Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm">
            {/* Step Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D8]">
              <div>
                <div className="text-[10px] font-bold text-[#8C7A5B] tracking-wider uppercase">
                  CURRENT STEP • 0{activeStepTab} / 07
                </div>
                <h2 className="text-xl font-serif font-bold text-[#1B3B2B] mt-0.5">
                  {STAGES[activeStepTab - 1].title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveStepData(false)}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  {saving ? "Saving..." : "Save Draft"}
                </button>
              </div>
            </div>

            {/* INITIAL ENQUIRY SNIPPET */}
            <div className="my-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8]">
              <div className="text-[10px] font-bold text-[#7C887E] tracking-wider uppercase mb-1">
                INITIAL ENQUIRY FROM VISITOR
              </div>
              <div className="text-xs text-[#1B3B2B]">
                <span className="font-semibold">{lead.serviceCategory || "General Consultation"}</span>
                {lead.location ? ` in ${lead.location}` : ""}
              </div>
              {lead.message ? (
                <div className="mt-1 text-xs text-[#4A5D4E] italic bg-white p-2.5 rounded-lg border border-[#E6E1D8]/60">
                  "{lead.message}"
                </div>
              ) : null}
            </div>

            {/* STEP 1: PROSPECTING */}
            {activeStepTab === 1 && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Initial Enquiry Reason & Need
                  </label>
                  <textarea
                    rows={3}
                    value={lead.stageProspecting?.enquiryReason || lead.message || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageProspecting: {
                          ...(lead.stageProspecting || {}),
                          enquiryReason: e.target.value,
                        },
                      })
                    }
                    placeholder="Why did the customer reach out? What are their core goals?"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Customer Expectations & Interest
                    </label>
                    <input
                      type="text"
                      value={lead.stageProspecting?.customerExpectations || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageProspecting: {
                            ...(lead.stageProspecting || {}),
                            customerExpectations: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Turnkey farm management, organic vegetables"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Initial Budget Estimate (₹)
                    </label>
                    <input
                      type="number"
                      value={lead.stageProspecting?.initialBudgetEstimate || lead.estimatedDealValue || ""}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        setLead({
                          ...lead,
                          estimatedDealValue: val,
                          stageProspecting: {
                            ...(lead.stageProspecting || {}),
                            initialBudgetEstimate: val,
                          },
                        });
                      }}
                      placeholder="e.g. 250000"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Assigned Sales Executive
                    </label>
                    <input
                      type="text"
                      value={lead.assignedExecutive || "Suresh Varma"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          assignedExecutive: e.target.value,
                          stageProspecting: {
                            ...(lead.stageProspecting || {}),
                            assignedSalesExecutive: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Next Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={lead.nextFollowUpDate || lead.stageProspecting?.nextFollowUpDate || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          nextFollowUpDate: e.target.value,
                          stageProspecting: {
                            ...(lead.stageProspecting || {}),
                            nextFollowUpDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Prospecting Notes & Contact Summary
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageProspecting?.prospectingNotes || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageProspecting: {
                          ...(lead.stageProspecting || {}),
                          prospectingNotes: e.target.value,
                        },
                      })
                    }
                    placeholder="Log details from first conversation or WhatsApp exchange..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: QUALIFICATION */}
            {activeStepTab === 2 && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Qualification Status
                    </label>
                    <select
                      value={lead.stageQualification?.qualificationStatus || "needs_more_info"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            qualificationStatus: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    >
                      <option value="needs_more_info">Needs More Info</option>
                      <option value="qualified">Qualified Lead</option>
                      <option value="disqualified">Disqualified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Total Land Area (Acres / Sqft)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={lead.stageQualification?.totalAreaAcres || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            totalAreaAcres: Number(e.target.value),
                          },
                        })
                      }
                      placeholder="e.g. 2.5"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Operation Scale
                    </label>
                    <select
                      value={lead.stageQualification?.operationScale || "small"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            operationScale: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    >
                      <option value="small">Small (&lt; 2 Acres / Rooftop)</option>
                      <option value="medium">Medium (2 - 10 Acres)</option>
                      <option value="large">Large (10+ Acres / Commercial)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Primary Crop / Focus
                    </label>
                    <input
                      type="text"
                      value={lead.stageQualification?.primaryCrop || lead.stageQualification?.cropType || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            primaryCrop: e.target.value,
                            cropType: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Mango, Guava, Organic Vegetables, Native Trees"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Water Availability
                    </label>
                    <select
                      value={lead.stageQualification?.waterAvailability || "available"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            waterAvailability: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    >
                      <option value="available">Borewell / Canal Available</option>
                      <option value="seasonal">Seasonal Water Only</option>
                      <option value="limited">Limited Water Supply</option>
                      <option value="unavailable">No Water Source Yet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Customer Requirement Summary
                  </label>
                  <textarea
                    rows={3}
                    value={lead.stageQualification?.requirementSummary || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageQualification: {
                          ...(lead.stageQualification || {}),
                          requirementSummary: e.target.value,
                        },
                      })
                    }
                    placeholder="Summarize the land conditions, accessibility, constraints, and scope..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: NEED ANALYSIS */}
            {activeStepTab === 3 && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Site Inspection Status
                    </label>
                    <select
                      value={lead.stageNeedAnalysis?.siteInspectionRequired ? "yes" : "no"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            siteInspectionRequired: e.target.value === "yes",
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    >
                      <option value="yes">Site Visit Required</option>
                      <option value="no">Desk Review Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Inspection Date
                    </label>
                    <input
                      type="date"
                      value={lead.stageNeedAnalysis?.siteVisitDate || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            siteVisitDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Soil Type & Condition
                    </label>
                    <input
                      type="text"
                      value={lead.stageNeedAnalysis?.soilType || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            soilType: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Red Loam, Clay, Black Cotton"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Existing Irrigation & Water Quality
                    </label>
                    <input
                      type="text"
                      value={lead.stageNeedAnalysis?.irrigationSystemType || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            irrigationSystemType: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Flood irrigation, Drip needed, High TDS"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Pest, Disease or Drainage Concerns
                    </label>
                    <input
                      type="text"
                      value={lead.stageNeedAnalysis?.cropHealthConcerns || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            cropHealthConcerns: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Root rot, wild boar fencing needed, water stagnation"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Agronomic Analysis Notes & Diagnosis
                  </label>
                  <textarea
                    rows={3}
                    value={lead.stageNeedAnalysis?.analysisNotes || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageNeedAnalysis: {
                          ...(lead.stageNeedAnalysis || {}),
                          analysisNotes: e.target.value,
                        },
                      })
                    }
                    placeholder="Document technical findings, topography, tree count, and required inputs..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: VALUE PROPOSITION */}
            {activeStepTab === 4 && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Proposed Agronomic Solution & Implementation Approach
                  </label>
                  <textarea
                    rows={3}
                    value={lead.stageValueProposition?.proposedSolution || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageValueProposition: {
                          ...(lead.stageValueProposition || {}),
                          proposedSolution: e.target.value,
                        },
                      })
                    }
                    placeholder="Outline the planned agricultural package, organic inputs, precision drip, and schedule..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Quotation Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={lead.stageValueProposition?.quotationAmount || ""}
                      onChange={(e) => {
                        const quote = Number(e.target.value);
                        const disc = lead.stageValueProposition?.applicableDiscounts || 0;
                        const tax = lead.stageValueProposition?.applicableTaxes || 0;
                        const finalAmt = Math.max(0, quote - disc + tax);
                        setLead({
                          ...lead,
                          estimatedDealValue: finalAmt,
                          stageValueProposition: {
                            ...(lead.stageValueProposition || {}),
                            quotationAmount: quote,
                            finalQuotedAmount: finalAmt,
                          },
                        });
                      }}
                      placeholder="e.g. 250000"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={lead.stageValueProposition?.applicableDiscounts || ""}
                      onChange={(e) => {
                        const disc = Number(e.target.value);
                        const quote = lead.stageValueProposition?.quotationAmount || 0;
                        const tax = lead.stageValueProposition?.applicableTaxes || 0;
                        const finalAmt = Math.max(0, quote - disc + tax);
                        setLead({
                          ...lead,
                          estimatedDealValue: finalAmt,
                          stageValueProposition: {
                            ...(lead.stageValueProposition || {}),
                            applicableDiscounts: disc,
                            finalQuotedAmount: finalAmt,
                          },
                        });
                      }}
                      placeholder="0"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Final Quoted Deal Value (₹)
                    </label>
                    <input
                      type="number"
                      value={
                        lead.stageValueProposition?.finalQuotedAmount ||
                        lead.estimatedDealValue ||
                        ""
                      }
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setLead({
                          ...lead,
                          estimatedDealValue: val,
                          stageValueProposition: {
                            ...(lead.stageValueProposition || {}),
                            finalQuotedAmount: val,
                          },
                        });
                      }}
                      placeholder="Final Quotation"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg font-bold text-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Proposal Document Link / PDF URL
                    </label>
                    <input
                      type="text"
                      value={lead.stageValueProposition?.proposalDocumentUrl || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageValueProposition: {
                            ...(lead.stageValueProposition || {}),
                            proposalDocumentUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="https://drive.google.com/... or uploaded document"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Proposed Implementation Timeline
                    </label>
                    <input
                      type="text"
                      value={lead.stageValueProposition?.proposedTimeline || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageValueProposition: {
                            ...(lead.stageValueProposition || {}),
                            proposedTimeline: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 6 Weeks (Phase 1: Soil & Drip, Phase 2: Planting)"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Client Feedback on Proposal
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageValueProposition?.customerFeedback || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageValueProposition: {
                          ...(lead.stageValueProposition || {}),
                          customerFeedback: e.target.value,
                        },
                      })
                    }
                    placeholder="How did the client react to the quotation? Any requested revisions?"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: DECISION MAKERS */}
            {activeStepTab === 5 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-wider">
                    Identified Stakeholders & Approvers
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const dmList = lead.stageDecisionMakers?.decisionMakers || [];
                      const newDm: DecisionMaker = {
                        id: `dm_${Date.now()}`,
                        fullName: "",
                        designation: "Landowner / Partner",
                        roleInDecision: "primary_decision_maker",
                        decisionAuthority: "full",
                        approvalStatus: "pending",
                      };
                      setLead({
                        ...lead,
                        stageDecisionMakers: {
                          ...(lead.stageDecisionMakers || {}),
                          decisionMakers: [...dmList, newDm],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6]"
                  >
                    <Plus className="w-3 h-3" /> Add Stakeholder
                  </button>
                </div>

                {(lead.stageDecisionMakers?.decisionMakers || []).length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#7C887E] bg-[#FAF8F5] rounded-xl border border-dashed border-[#DCD5C5]">
                    No stakeholders registered yet. Add primary decision makers, family members, or estate managers.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lead.stageDecisionMakers?.decisionMakers?.map((dm, idx) => (
                      <div
                        key={dm.id}
                        className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6E1D8] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1B3B2B]">
                            Stakeholder #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (lead.stageDecisionMakers?.decisionMakers || []).filter(
                                (d) => d.id !== dm.id
                              );
                              setLead({
                                ...lead,
                                stageDecisionMakers: {
                                  ...(lead.stageDecisionMakers || {}),
                                  decisionMakers: updated,
                                },
                              });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={dm.fullName}
                            onChange={(e) => {
                              const list = [...(lead.stageDecisionMakers?.decisionMakers || [])];
                              list[idx].fullName = e.target.value;
                              setLead({
                                ...lead,
                                stageDecisionMakers: {
                                  ...(lead.stageDecisionMakers || {}),
                                  decisionMakers: list,
                                },
                              });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-[#DCD5C5] rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Designation / Relation"
                            value={dm.designation || ""}
                            onChange={(e) => {
                              const list = [...(lead.stageDecisionMakers?.decisionMakers || [])];
                              list[idx].designation = e.target.value;
                              setLead({
                                ...lead,
                                stageDecisionMakers: {
                                  ...(lead.stageDecisionMakers || {}),
                                  decisionMakers: list,
                                },
                              });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-[#DCD5C5] rounded-lg"
                          />
                          <select
                            value={dm.approvalStatus}
                            onChange={(e) => {
                              const list = [...(lead.stageDecisionMakers?.decisionMakers || [])];
                              list[idx].approvalStatus = e.target.value as any;
                              setLead({
                                ...lead,
                                stageDecisionMakers: {
                                  ...(lead.stageDecisionMakers || {}),
                                  decisionMakers: list,
                                },
                              });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-[#DCD5C5] rounded-lg font-medium"
                          >
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approved Deal</option>
                            <option value="objected">Raised Objections</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Decision Making Process & Approval Blockers
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageDecisionMakers?.decisionMakingProcess || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageDecisionMakers: {
                          ...(lead.stageDecisionMakers || {}),
                          decisionMakingProcess: e.target.value,
                        },
                      })
                    }
                    placeholder="Document who needs to sign, payment release conditions, or internal family deliberations..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: NEGOTIATION & PAYMENT */}
            {activeStepTab === 6 && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Final Agreed Amount (₹) *
                    </label>
                    <input
                      type="number"
                      value={
                        lead.stageNegotiation?.finalAgreedAmount ||
                        lead.stageValueProposition?.finalQuotedAmount ||
                        lead.estimatedDealValue ||
                        ""
                      }
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setLead({
                          ...lead,
                          estimatedDealValue: val,
                          stageNegotiation: {
                            ...(lead.stageNegotiation || { paymentStatus: "pending" }),
                            finalAgreedAmount: val,
                          },
                        });
                      }}
                      placeholder="e.g. 240000"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg font-bold text-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Advance Required (₹)
                    </label>
                    <input
                      type="number"
                      value={lead.stageNegotiation?.advanceAmountRequired || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNegotiation: {
                            ...(lead.stageNegotiation || { paymentStatus: "pending" }),
                            advanceAmountRequired: Number(e.target.value),
                          },
                        })
                      }
                      placeholder="e.g. 100000"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Payment Status
                    </label>
                    <select
                      value={lead.stageNegotiation?.paymentStatus || "pending"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNegotiation: {
                            ...(lead.stageNegotiation || {}),
                            paymentStatus: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg font-semibold text-[#1B3B2B]"
                    >
                      <option value="pending">Pending Advance</option>
                      <option value="partially_paid">Partially Paid</option>
                      <option value="paid">Advance Fully Received</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Contract & Agreement Status
                    </label>
                    <select
                      value={lead.stageNegotiation?.contractStatus || "draft"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNegotiation: {
                            ...(lead.stageNegotiation || { paymentStatus: "pending" }),
                            contractStatus: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    >
                      <option value="draft">Contract In Draft</option>
                      <option value="under_review">Shared / Under Client Review</option>
                      <option value="signed">Signed & Executed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Agreed Payment Terms
                    </label>
                    <input
                      type="text"
                      value={lead.stageNegotiation?.paymentTerms || "40% advance, 40% civil completion, 20% handover"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNegotiation: {
                            ...(lead.stageNegotiation || { paymentStatus: "pending" }),
                            paymentTerms: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                {/* Quick Advance Payment Receipt Logger */}
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">
                      Record Advance Payment Receipt
                    </span>
                    <span className="text-xs font-mono text-emerald-700">
                      Total Received: ₹{lead.stageNegotiation?.totalReceived || 0}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="number"
                      id="advanceInputAmount"
                      placeholder="Amount Received (₹)"
                      className="px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg text-emerald-950"
                    />
                    <input
                      type="text"
                      id="advanceRefNumber"
                      placeholder="Bank Ref / UPI Transaction ID"
                      className="px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const amtEl = document.getElementById("advanceInputAmount") as HTMLInputElement;
                        const refEl = document.getElementById("advanceRefNumber") as HTMLInputElement;
                        const amt = amtEl ? Number(amtEl.value) : 0;
                        const refNum = refEl ? refEl.value : "";
                        if (!amt || amt <= 0) {
                          return alert("Please enter a valid amount");
                        }

                        const currentTotal = (lead.stageNegotiation?.totalReceived || 0) + amt;
                        const records = lead.stageNegotiation?.paymentRecords || [];
                        const newRec: PaymentRecord = {
                          id: `pay_${Date.now()}`,
                          date: new Date().toISOString().split("T")[0],
                          amount: amt,
                          type: "advance",
                          paymentMethod: "bank_transfer",
                          referenceNumber: refNum || `TXN-${Date.now()}`,
                          receivedBy: "Finance Desk",
                        };

                        setLead({
                          ...lead,
                          stageNegotiation: {
                            ...(lead.stageNegotiation || { paymentStatus: "partially_paid" }),
                            totalReceived: currentTotal,
                            paymentStatus: "paid",
                            paymentRecords: [...records, newRec],
                          },
                        });

                        if (amtEl) amtEl.value = "";
                        if (refEl) refEl.value = "";
                        showToast(`Recorded payment of ₹${amt.toLocaleString("en-IN")}`);
                      }}
                      className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
                    >
                      + Save Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: CLOSED WON */}
            {activeStepTab === 7 && (
              <div className="space-y-5 pt-2">
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-emerald-950">
                        Deal Closed Won & Execution Handover
                      </h3>
                      <p className="text-xs text-emerald-800">
                        Final commercial terms agreed. Convert this deal to an Active Project with milestones.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs">
                    <div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase">Won Deal Value</div>
                      <div className="font-bold text-emerald-950 text-sm mt-0.5">
                        ₹
                        {(
                          lead.finalWonRevenue ||
                          lead.stageNegotiation?.finalAgreedAmount ||
                          lead.estimatedDealValue ||
                          0
                        ).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase">Advance Received</div>
                      <div className="font-bold text-emerald-950 text-sm mt-0.5">
                        ₹{(lead.stageNegotiation?.totalReceived || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase">Customer Location</div>
                      <div className="font-bold text-emerald-950 text-sm mt-0.5">
                        {lead.location || "Rajahmundry"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase">Target Area</div>
                      <div className="font-bold text-emerald-950 text-sm mt-0.5">
                        {lead.stageQualification?.totalAreaAcres || 0} Acres
                      </div>
                    </div>
                  </div>
                </div>

                {lead.projectId ? (
                  <div className="p-4 bg-[#FAF8F5] border border-[#DCD5C5] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1B3B2B]">
                        Active Project Created & Linked
                      </div>
                      <div className="text-xs text-[#7C887E] mt-0.5 font-mono">
                        Project ID: {lead.projectId}
                      </div>
                    </div>
                    <Link
                      href="/admin/projects"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-colors"
                    >
                      View in Projects <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <button
                      type="button"
                      onClick={handleConvertToProject}
                      disabled={converting}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition-all disabled:opacity-60"
                    >
                      <Sparkles className="w-4 h-4 text-[#C5A869]" />
                      {converting ? "Creating Project..." : "Convert Deal to Active Project →"}
                    </button>
                    <p className="text-[11px] text-[#7C887E] mt-2">
                      Automatically generates project reference `PRJ-...`, maps specs, milestones, and locks sales stage.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step Action Footer */}
            <div className="mt-8 pt-4 border-t border-[#E6E1D8] flex items-center justify-between">
              <div>
                {activeStepTab > 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStepTab((prev) => Math.max(1, prev - 1))}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#4A5D4E] hover:text-[#1B3B2B] transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous Step
                  </button>
                ) : <div />}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSaveStepData(false)}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-[#1B3B2B] bg-[#F3EFE6] hover:bg-[#EBE5D8] rounded-lg transition-colors"
                >
                  Save Draft
                </button>

                {activeStepTab < 7 ? (
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(true)}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all shadow-sm"
                  >
                    Save & Next Step
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Bottom Card: Close as Lost / Reopen */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-sm">
            {isLost ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                    Deal Marked as Closed Lost
                  </h4>
                  <p className="text-xs text-[#7C887E] mt-0.5">
                    Reason: {lead.stageClosedLost?.lossReason?.replace(/_/g, " ")}.
                    {lead.stageClosedLost?.lossNotes ? ` Note: "${lead.stageClosedLost.lossNotes}"` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    placeholder="Reason for reopening..."
                    className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleReopenDeal}
                    disabled={reopening}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {reopening ? "Reopening..." : "Reopen Enquiry"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-xs font-bold text-[#7C887E] uppercase tracking-wider mb-2">
                  Need to close this enquiry?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value)}
                    aria-label="Loss Reason"
                    className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B]"
                  >
                    <option value="budget_limitations">Budget Limitations</option>
                    <option value="chose_competitor">Chose Competitor</option>
                    <option value="project_postponed">Project Postponed</option>
                    <option value="requirements_not_suitable">Requirements Not Suitable</option>
                    <option value="no_response">Client Not Responding</option>
                    <option value="infeasible">Agronomically Infeasible</option>
                    <option value="other">Other Reason</option>
                  </select>

                  <input
                    type="text"
                    value={lossNotes}
                    onChange={(e) => setLossNotes(e.target.value)}
                    placeholder="Reason details or remarks..."
                    className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B]"
                  />

                  <button
                    type="button"
                    onClick={handleCloseAsLost}
                    disabled={closingLost}
                    className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors text-center"
                  >
                    {closingLost ? "Closing..." : "Close as Lost"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: THE PAPER TRAIL & Activity Logger */}
        <div className="space-y-6">
          {/* Quick Activity Logger */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-sm">
            <h3 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C5A869]" />
              Log Customer Interaction
            </h3>

            <form onSubmit={handleLogActivity} className="space-y-3">
              <div>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                >
                  <option value="phone_call">Phone Call</option>
                  <option value="whatsapp_sent">WhatsApp Message</option>
                  <option value="email_sent">Email Sent</option>
                  <option value="site_visit">Site Visit / Inspection</option>
                  <option value="meeting_held">Discussion / Meeting</option>
                  <option value="note_added">Internal Note</option>
                </select>
              </div>

              <div>
                <textarea
                  rows={3}
                  required
                  value={activityNote}
                  onChange={(e) => setActivityNote(e.target.value)}
                  placeholder="Summarize discussion, follow-up commitments, or next steps..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                />
              </div>

              <button
                type="submit"
                disabled={loggingActivity}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-colors disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                {loggingActivity ? "Recording..." : "Record Activity"}
              </button>
            </form>
          </div>

          {/* Chronological Activity Timeline */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-sm">
            <div className="text-[10px] font-bold text-[#7C887E] uppercase tracking-wider mb-3">
              THE PAPER TRAIL • TIMELINE
            </div>

            {(!lead.activities || lead.activities.length === 0) ? (
              <p className="text-xs text-[#7C887E]">No activities recorded yet.</p>
            ) : (
              <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6E1D8]">
                {lead.activities.map((act) => (
                  <div key={act.id} className="relative group">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#1B3B2B] ring-4 ring-white" />
                    <div>
                      <div className="text-xs font-bold text-[#1B3B2B] leading-tight">
                        {act.title}
                      </div>
                      <div className="text-[10px] text-[#7C887E] mt-0.5">
                        {new Date(act.timestamp).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {act.description && (
                        <p className="text-[11px] text-[#4A5D4E] mt-1 bg-[#FAF8F5] p-2 rounded-lg border border-[#E6E1D8]/60 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
