import React from "react";

interface AdminCardProps {
  title?: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
}

export default function AdminCard({
  title,
  subtitle,
  actions,
  children,
  className = "",
  bodyClassName = "p-5 sm:p-6",
  headerClassName = "px-5 py-4 sm:px-6 sm:py-4.5",
}: AdminCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-cream-border shadow-soft overflow-hidden ${className}`}
    >
      {(title || actions) && (
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-border/70 bg-ivory-surface/40 ${headerClassName}`}
        >
          <div>
            {typeof title === "string" ? (
              <h3 className="font-serif text-lg font-bold text-forest">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-charcoal-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
