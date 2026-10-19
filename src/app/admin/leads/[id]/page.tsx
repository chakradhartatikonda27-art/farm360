"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
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

  // Helper to toggle challenges in Step 3
  const toggleChallenge = (challengeName: string) => {
    if (!lead) return;
    const currentList = lead.stageNeedAnalysis?.challengesIdentified || ["Pest", "Soil", "Irrigation", "Yield"];
    const exists = currentList.includes(challengeName);
    const updated = exists ? currentList.filter((c) => c !== challengeName) : [...currentList, challengeName];

    setLead({
      ...lead,
      stageNeedAnalysis: {
        ...(lead.stageNeedAnalysis || {}),
        challengesIdentified: updated,
      },
    });
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
        showToast(`Progressed to Step ${activeStepTab + 1}: ${STAGES[activeStepTab].title}`);
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

  // Challenges list for Need Analysis
  const challengesList = lead.stageNeedAnalysis?.challengesIdentified || ["Pest", "Soil", "Irrigation", "Yield"];

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

      {/* LEAD JOURNEY Stepper Banner (Matching Screenshots) */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E6E1D8] p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[11px] font-bold text-[#4A5D4E] tracking-wider uppercase">
              LEAD JOURNEY
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1B3B2B] mt-0.5">
              One clear step at a time
            </h2>
          </div>
          <div className="text-xs font-semibold text-[#1B3B2B] bg-white px-3 py-1 rounded-full border border-[#DCD5C5]">
            {activeStepTab} of 7
          </div>
        </div>

        {/* Stepper Steps Row */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[760px] relative px-4">
            {STAGES.map((s, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStepNumber || lead.status === "closed_won";
              const isInProgress = stepNum === currentStepNumber && !isLost;
              const isSelected = activeStepTab === stepNum;

              return (
                <React.Fragment key={s.key}>
                  {/* Step Node */}
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(stepNum)}
                    className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    {isCompleted ? (
                      /* Completed Step: Green circle with checkmark */
                      <div className="w-8 h-8 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : isInProgress ? (
                      /* In Progress Step: Double gold ring with number */
                      <div className="w-9 h-9 rounded-full border-2 border-[#C5A869] bg-white flex items-center justify-center p-0.5 shadow-md">
                        <div className="w-full h-full rounded-full border border-[#C5A869] flex items-center justify-center text-xs font-bold text-[#1B3B2B]">
                          {stepNum}
                        </div>
                      </div>
                    ) : (
                      /* Up Next Step: Light grey circle with number */
                      <div className="w-8 h-8 rounded-full border border-[#DCD5C5] bg-white text-[#7C887E] flex items-center justify-center text-xs font-medium">
                        {stepNum}
                      </div>
                    )}

                    {/* Step Title & Subtitle */}
                    <div className="text-center mt-2">
                      <div
                        className={`text-xs whitespace-nowrap ${
                          isSelected || isInProgress
                            ? "font-bold text-[#1B3B2B]"
                            : isCompleted
                            ? "font-semibold text-[#1B3B2B]"
                            : "font-medium text-[#7C887E]"
                        }`}
                      >
                        {s.title}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isCompleted
                            ? "text-[#7C887E]"
                            : isInProgress
                            ? "text-[#C5A869] font-bold"
                            : "text-[#A0A8A0]"
                        }`}
                      >
                        {isCompleted ? "Complete" : isInProgress ? "In progress" : "Up next"}
                      </div>
                    </div>
                  </button>

                  {/* Horizontal Connector Line between steps */}
                  {idx < STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 -mt-7 transition-colors ${
                        stepNum < currentStepNumber ? "bg-[#1B3B2B]" : "bg-[#E6E1D8]"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Stage Form + Right THE PAPER TRAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dedicated Step Form (Matching Screenshots) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm">
            {/* Step Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D8]">
              <div>
                <div className="text-[10px] font-bold text-[#7C887E] tracking-wider uppercase">
                  CURRENT STEP • 0{activeStepTab} / 07
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1B3B2B] mt-0.5">
                  {STAGES[activeStepTab - 1].title}
                </h2>
              </div>

              {/* Status Indicator Dot from screenshot */}
              <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
            </div>

            {/* INITIAL ENQUIRY Box (Matching Screenshot) */}
            <div className="my-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8]">
              <div className="text-[10px] font-bold text-[#7C887E] tracking-wider uppercase mb-1.5">
                INITIAL ENQUIRY
              </div>
              <div className="text-sm font-semibold text-[#1B3B2B]">
                {lead.name}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded bg-[#EBE5D8] text-[#1B3B2B] text-xs font-medium">
                  {lead.serviceCategory || "Small Plot & Site Gardening"}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#EBE5D8] text-[#1B3B2B] text-xs font-medium">
                  {lead.location || "india"}
                </span>
              </div>
              {lead.message && (
                <div className="mt-2.5 text-xs text-[#4A5D4E] italic bg-white p-2.5 rounded-lg border border-[#E6E1D8]/70">
                  "{lead.message}"
                </div>
              )}
            </div>

            {/* STEP 1: PROSPECTING */}
            {activeStepTab === 1 && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#7C887E]">
                  Capture initial contact details, reason for enquiry, and establish contact history.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Initial enquiry reason *
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
                      Customer expectations *
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
                      Initial budget estimate (₹)
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
                      Assigned executive
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
                      Next follow-up date
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
                    Prospecting notes
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

                {/* Bottom Step Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E1D8]">
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(false)}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
                  >
                    Save prospecting
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(true)}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all"
                  >
                    Save & continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: QUALIFICATION (Exact layout from Screenshot 1 & 4) */}
            {activeStepTab === 2 && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#7C887E]">
                  Understand the customer's need and whether the service is a fit. Agricultural details are optional when they do not apply.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Customer need *
                  </label>
                  <textarea
                    rows={3}
                    value={lead.stageQualification?.customerNeed || lead.stageQualification?.requirementSummary || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageQualification: {
                          ...(lead.stageQualification || {}),
                          customerNeed: e.target.value,
                          requirementSummary: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Terrace garden setup with automated micro-drip irrigation"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    How FARM360 can help *
                  </label>
                  <textarea
                    rows={3}
                    value={lead.stageQualification?.howWeCanHelp || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageQualification: {
                          ...(lead.stageQualification || {}),
                          howWeCanHelp: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Provide end-to-end design, soil bed preparation, seed sourcing, and monthly upkeep"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Project scale *
                    </label>
                    <select
                      value={lead.stageQualification?.operationScale || lead.stageQualification?.projectScale || "small"}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            operationScale: e.target.value as any,
                            projectScale: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Land area / acreage
                    </label>
                    <input
                      type="text"
                      value={lead.stageQualification?.landArea || lead.stageQualification?.totalAreaAcres || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            landArea: e.target.value,
                            totalAreaAcres: Number(e.target.value) || e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 2 acres"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Crop type
                    </label>
                    <input
                      type="text"
                      value={lead.stageQualification?.cropType || lead.stageQualification?.primaryCrop || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            cropType: e.target.value,
                            primaryCrop: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Organic Vegetables, Fruits, Mango"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Water availability
                    </label>
                    <input
                      type="text"
                      value={lead.stageQualification?.waterAvailability || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageQualification: {
                            ...(lead.stageQualification || {}),
                            waterAvailability: e.target.value as any,
                          },
                        })
                      }
                      placeholder="e.g. Borewell water, municipal supply"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Constraints
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageQualification?.constraints || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageQualification: {
                          ...(lead.stageQualification || {}),
                          constraints: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Limited sunlight, water pressure issues, high wind on terrace"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Qualification notes
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageQualification?.qualificationNotes || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageQualification: {
                          ...(lead.stageQualification || {}),
                          qualificationNotes: e.target.value,
                        },
                      })
                    }
                    placeholder="Remarks regarding readiness, timeline, and customer commitment..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                {/* Bottom Step Actions (Matching Screenshot 4) */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E1D8]">
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(false)}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
                  >
                    Save qualification
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(true)}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all"
                  >
                    Save & continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: NEED ANALYSIS (Exact layout from Screenshot 2 & 3) */}
            {activeStepTab === 3 && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#7C887E]">
                  Capture the customer's goals and the conditions that will shape a workable plan.
                </p>

                {/* Challenges identified Chips (Matching Screenshot 3) */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-2">
                    Challenges identified
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {["Pest", "Soil", "Irrigation", "Yield"].map((challenge) => {
                      const isSelected = challengesList.includes(challenge);
                      return (
                        <button
                          key={challenge}
                          type="button"
                          onClick={() => toggleChallenge(challenge)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-[#1B3B2B] text-white border border-[#1B3B2B]"
                              : "bg-white text-[#4A5D4E] border border-[#DCD5C5] hover:border-[#1B3B2B]"
                          }`}
                        >
                          {challenge}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Challenge Textareas 2x2 Grid (Matching Screenshot 3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Pest challenges
                    </label>
                    <textarea
                      rows={3}
                      value={lead.stageNeedAnalysis?.pestChallengesText || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            pestChallengesText: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Leaf miners, mealybugs, aphids"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Soil challenges
                    </label>
                    <textarea
                      rows={3}
                      value={lead.stageNeedAnalysis?.soilChallengesText || lead.stageNeedAnalysis?.soilType || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            soilChallengesText: e.target.value,
                            soilType: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. High salinity, poor aeration, clay compaction"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Irrigation challenges
                    </label>
                    <textarea
                      rows={3}
                      value={lead.stageNeedAnalysis?.irrigationChallengesText || lead.stageNeedAnalysis?.irrigationSystemType || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            irrigationChallengesText: e.target.value,
                            irrigationSystemType: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Irregular water pressure, no timer system, clogged lines"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Yield challenges
                    </label>
                    <textarea
                      rows={3}
                      value={lead.stageNeedAnalysis?.yieldChallengesText || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageNeedAnalysis: {
                            ...(lead.stageNeedAnalysis || {}),
                            yieldChallengesText: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Low fruit set, flower dropping, stunted vegetative growth"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                {/* Client goals and current practices (Matching Screenshot 2) */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Client goals *
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageNeedAnalysis?.clientGoals || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageNeedAnalysis: {
                          ...(lead.stageNeedAnalysis || {}),
                          clientGoals: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Year-round supply of fresh organic leafy greens and herbs"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Current farming practices
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageNeedAnalysis?.currentPractices || lead.stageNeedAnalysis?.currentOperatingProcess || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageNeedAnalysis: {
                          ...(lead.stageNeedAnalysis || {}),
                          currentPractices: e.target.value,
                          currentOperatingProcess: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Manual watering twice a day, sporadic application of cow dung manure"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Other challenges
                  </label>
                  <textarea
                    rows={2}
                    value={lead.stageNeedAnalysis?.otherChallengesText || lead.stageNeedAnalysis?.otherChallenges || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageNeedAnalysis: {
                          ...(lead.stageNeedAnalysis || {}),
                          otherChallengesText: e.target.value,
                          otherChallenges: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Lack of skilled maintenance labour, monkey menace"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Analysis notes *
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
                    placeholder="Comprehensive agronomist summary shaping the value proposition..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                {/* Bottom Step Actions (Matching Screenshot 2) */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E1D8]">
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(false)}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
                  >
                    Save analysis
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(true)}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all"
                  >
                    Save & continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: VALUE PROPOSITION (Exact layout from Screenshot 5) */}
            {activeStepTab === 4 && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#7C887E]">
                  Describe the recommendation and benefits without promising unsupported results.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Value proposition *
                  </label>
                  <textarea
                    rows={3}
                    value={lead.stageValueProposition?.valuePropositionText || lead.stageValueProposition?.proposedSolution || ""}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        stageValueProposition: {
                          ...(lead.stageValueProposition || {}),
                          valuePropositionText: e.target.value,
                          proposedSolution: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Turnkey raised wooden planter bed setup with automated drip lines and bi-weekly agronomy audits"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Expected benefits
                    </label>
                    <textarea
                      rows={3}
                      value={lead.stageValueProposition?.expectedBenefitsText || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageValueProposition: {
                            ...(lead.stageValueProposition || {}),
                            expectedBenefitsText: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 100% pesticide-free produce, 60% water savings, improved property aesthetics"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      ROI statement (only when defensible)
                    </label>
                    <textarea
                      rows={3}
                      value={lead.stageValueProposition?.roiStatement || lead.stageValueProposition?.expectedOutcomeROI || ""}
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          stageValueProposition: {
                            ...(lead.stageValueProposition || {}),
                            roiStatement: e.target.value,
                            expectedOutcomeROI: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Estimated annual savings of ₹36,000 in grocery costs + zero pesticide exposure"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Quotation amount (₹)
                    </label>
                    <input
                      type="number"
                      value={lead.stageValueProposition?.quotationAmount || ""}
                      onChange={(e) => {
                        const quote = Number(e.target.value);
                        const disc = lead.stageValueProposition?.applicableDiscounts || 0;
                        const finalAmt = Math.max(0, quote - disc);
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
                        const finalAmt = Math.max(0, quote - disc);
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
                      Final quoted deal value (₹)
                    </label>
                    <input
                      type="number"
                      value={lead.stageValueProposition?.finalQuotedAmount || lead.estimatedDealValue || ""}
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
                      Proposal document link / PDF URL
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
                      Customer feedback on proposal
                    </label>
                    <input
                      type="text"
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
                      placeholder="e.g. Client agreed to quotation; requested split billing"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                    />
                  </div>
                </div>

                {/* Bottom Step Actions (Matching Screenshot 5) */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E1D8]">
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(false)}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
                  >
                    Save proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(true)}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all"
                  >
                    Save & continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: DECISION MAKERS */}
            {activeStepTab === 5 && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#7C887E]">
                  Identify key decision makers, their authority, and any pending approvals or objections.
                </p>

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
                    No stakeholders registered yet. Click "+ Add Stakeholder" to record decision makers.
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
                    Decision making process & approval blockers
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

                {/* Bottom Step Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E1D8]">
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(false)}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
                  >
                    Save stakeholders
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(true)}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all"
                  >
                    Save & continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: NEGOTIATION & PAYMENT */}
            {activeStepTab === 6 && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#7C887E]">
                  Finalize commercial agreements, record advance payments, and confirm contract execution.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                      Final agreed amount (₹) *
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
                      Advance required (₹)
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
                      Payment status
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
                      Contract & agreement status
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
                      Agreed payment terms
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

                {/* Bottom Step Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E1D8]">
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(false)}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors"
                  >
                    Save negotiation
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveStepData(true)}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all"
                  >
                    Save & continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: CLOSED WON */}
            {activeStepTab === 7 && (
              <div className="space-y-5 pt-2">
                <p className="text-xs text-[#7C887E]">
                  Celebrate the win and initiate project execution handover.
                </p>

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
                        Commercial terms agreed. Convert this deal to an Active Project with milestones.
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

        {/* Right 1 Col: THE PAPER TRAIL (Matching Screenshots) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-sm">
            {/* Header matching screenshot */}
            <div className="text-[10px] font-bold text-[#7C887E] uppercase tracking-wider">
              THE PAPER TRAIL
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1B3B2B] mt-1 mb-4">
              Recent activity
            </h3>

            {/* Timeline items matching screenshot */}
            {(!lead.activities || lead.activities.length === 0) ? (
              <p className="text-xs text-[#7C887E]">No activities recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {lead.activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5">
                    {/* Green dot from screenshot */}
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#1B3B2B] leading-snug">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-[#7C887E]">
                        {new Date(act.timestamp).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{", "}
                        {new Date(act.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" · "}
                        {act.userName || "admin@gmail.com"}
                      </div>
                      {act.description && (
                        <p className="text-[11px] text-[#4A5D4E] mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Activity Logger form */}
            <div className="mt-6 pt-4 border-t border-[#E6E1D8]">
              <div className="text-[11px] font-bold text-[#1B3B2B] mb-2">
                Quick Activity Note
              </div>
              <form onSubmit={handleLogActivity} className="space-y-2">
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B]"
                >
                  <option value="phone_call">Phone Call</option>
                  <option value="whatsapp_sent">WhatsApp Message</option>
                  <option value="email_sent">Email Sent</option>
                  <option value="site_visit">Site Visit</option>
                  <option value="note_added">Internal Note</option>
                </select>

                <textarea
                  rows={2}
                  required
                  value={activityNote}
                  onChange={(e) => setActivityNote(e.target.value)}
                  placeholder="Record summary..."
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg"
                />

                <button
                  type="submit"
                  disabled={loggingActivity}
                  className="w-full px-3 py-1.5 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-colors disabled:opacity-60"
                >
                  {loggingActivity ? "Recording..." : "Record Activity"}
                </button>
              </form>
            </div>

            {/* Direct Communication Quick Links */}
            <div className="mt-4 pt-3 border-t border-[#E6E1D8] flex items-center justify-around text-xs">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-1 text-[#1B3B2B] hover:underline font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#1B3B2B]" />
                Call
              </a>
              <span className="text-[#DCD5C5]">•</span>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-700 hover:underline font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
              {lead.email && (
                <>
                  <span className="text-[#DCD5C5]">•</span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-1 text-[#8C7A5B] hover:underline font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#8C7A5B]" />
                    Email
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
