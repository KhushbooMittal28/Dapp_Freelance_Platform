import React from "react";

const TYPES = {
  success: {
    bg: "bg-emerald-900/90 border-emerald-700/60",
    text: "text-emerald-200",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    iconColor: "text-emerald-400",
  },
  error: {
    bg: "bg-red-900/90 border-red-700/60",
    text: "text-red-200",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    iconColor: "text-red-400",
  },
  info: {
    bg: "bg-blue-900/90 border-blue-700/60",
    text: "text-blue-200",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    iconColor: "text-blue-400",
  },
};

export default function Toast({ message, type = "success" }) {
  const t = TYPES[type] || TYPES.success;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-2xl max-w-sm ${t.bg}`}>
        <svg className={`w-5 h-5 flex-shrink-0 ${t.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {t.icon}
        </svg>
        <p className={`text-sm font-medium ${t.text}`}>{message}</p>
      </div>
    </div>
  );
}
