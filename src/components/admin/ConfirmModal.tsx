"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import AdminButton from "./AdminButton";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-elevated border border-cream-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-cream-border/70 bg-ivory-surface">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                variant === "danger"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-forest/10 text-forest"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream-border/70 bg-cream/20">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </AdminButton>
          <AdminButton
            variant={variant}
            size="sm"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
