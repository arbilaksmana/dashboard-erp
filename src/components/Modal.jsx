import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full m-4 h-[calc(100vh-2rem)]"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`w-full bg-white dark:bg-[#131722] border border-slate-100 dark:border-[#222533] rounded-[24px] shadow-2xl overflow-hidden flex flex-col relative z-10 animate-slide-up ${
          sizeClasses[size]
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-[#222533] flex items-center justify-between">
          <h3 className="text-sm font-extrabold font-heading text-brand-navy dark:text-white uppercase tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-[#1d2230] text-slate-400 hover:text-brand-navy dark:hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[75vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
