import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

const STATUS = {
  0: { label: "Open",      bg: "bg-blue-900/30",    border: "border-blue-700/40",    text: "text-blue-300",    dot: "bg-blue-400"    },
  1: { label: "Assigned",  bg: "bg-amber-900/30",   border: "border-amber-700/40",   text: "text-amber-300",   dot: "bg-amber-400"   },
  2: { label: "Completed", bg: "bg-emerald-900/30", border: "border-emerald-700/40", text: "text-emerald-300", dot: "bg-emerald-400" },
  3: { label: "Cancelled", bg: "bg-red-900/30",     border: "border-red-700/40",     text: "text-red-300",     dot: "bg-red-400"     },
};

function formatDeadline(unixTs) {
  const ts = unixTs?.toNumber ? unixTs.toNumber() : Number(unixTs);
  if (!ts || ts === 0) return { label: "No deadline", isPast: false };
  const date = new Date(ts * 1000);
  const isPast = date.getTime() < Date.now();
  return {
    label: date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    isPast,
  };
}

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.bg} border ${s.border} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function StarRating({ value, interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-transform ${interactive && "hover:scale-110"}`}
        >
          <svg className={`w-5 h-5 ${star <= display ? "text-amber-400" : "text-gray-700"} transition-colors`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function MilestoneProgress({ completed, total }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>Milestones</span>
        <span>{completed}/{total} completed</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MilestoneDeadlines({ deadlines, milestonesCompleted }) {
  if (!deadlines || deadlines.length === 0) return null;
  return (
    <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
        Milestone Deadlines
      </p>
      <div className="space-y-2">
        {deadlines.map((dl, i) => {
          const { label, isPast } = formatDeadline(dl);
          const isDone    = i < milestonesCompleted;
          const isCurrent = i === milestonesCompleted;
          const isLate    = !isDone && isPast;
          return (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs border ${
                isDone    ? "bg-emerald-900/20 border-emerald-700/30" :
                isCurrent ? "bg-violet-900/20 border-violet-700/40"  :
                            "bg-gray-800/60 border-gray-700/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isDone    ? "bg-emerald-400"              :
                  isCurrent ? "bg-violet-400 animate-pulse" :
                              "bg-gray-600"
                }`} />
                <span className={`font-medium ${
                  isDone    ? "text-emerald-400" :
                  isCurrent ? "text-violet-300"  :
                              "text-gray-400"
                }`}>
                  Milestone {i + 1}
                  {isCurrent && <span className="ml-1 text-violet-500 font-normal">(current)</span>}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isDone  && <span className="text-emerald-500 font-bold">✓</span>}
                {isLate  && <span className="text-red-400 font-semibold">⚠ Late</span>}
                <span className={`font-mono ${
                  isDone    ? "text-emerald-400" :
                  isLate    ? "text-red-400"     :
                  isCurrent ? "text-violet-300"  :
                              "text-gray-500"
                }`}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Fetches the freelancer's profile live from the contract
function FreelancerInfo({ address }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || address === "0x0000000000000000000000000000000000000000") return;
    let cancelled = false;
    async function fetch() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const p = await contract.getProfile(address);
        if (!cancelled) setProfile({ name: p.name || "", skills: p.skills || "", bio: p.bio || "" });
      } catch (err) {
        if (!cancelled) setProfile({ name: "", skills: "", bio: "" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [address]);

  const short    = address ? `${address.slice(0, 8)}…${address.slice(-6)}` : "";
  const initials = profile?.name ? profile.name.slice(0, 2).toUpperCase() : "?";

  return (
    <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {loading
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : initials}
        </div>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="space-y-1.5">
              <div className="h-3 bg-gray-700 rounded animate-pulse w-28" />
              <div className="h-2.5 bg-gray-700/60 rounded animate-pulse w-36" />
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-white truncate">
                {profile?.name || "No profile set"}
              </p>
              <p className="text-xs text-gray-500 font-mono truncate">{short}</p>
            </>
          )}
        </div>
      </div>

      {/* Skills */}
      {!loading && profile?.skills && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.skills.split(",").slice(0, 4).map((s, i) =>
            s.trim() && (
              <span key={i} className="px-2 py-0.5 bg-violet-900/30 border border-violet-700/30 text-violet-300 rounded-md text-xs">
                {s.trim()}
              </span>
            )
          )}
        </div>
      )}

      {/* Bio */}
      {!loading && profile?.bio && (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{profile.bio}</p>
      )}

      {/* Fallback */}
      {!loading && !profile?.name && (
        <p className="text-xs text-gray-600 mt-2 italic">Freelancer has not set up a profile yet.</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main JobCard
// ─────────────────────────────────────────────

export default function JobCard({ job, account, actions, showLogs = false }) {
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const isClient      = account?.toLowerCase() === job.client?.toLowerCase();
  const isFreelancer  = account?.toLowerCase() === job.freelancer?.toLowerCase();
  const isCompleted   = job.status === 2;
  const isCancelled   = job.status === 3;
  const isAssigned    = job.status === 1;
  const isOpen        = job.status === 0;
  const isFinished    = isCompleted || isCancelled;
  const workSubmitted = !!job.workSubmitted;
  const hasFreelancer = job.freelancer && job.freelancer !== "0x0000000000000000000000000000000000000000";

  const amountRemaining = (parseFloat(job.totalPayment) - parseFloat(job.amountReleased)).toFixed(4);

  const handleRate = async () => {
    if (rating === 0) return;
    await actions.rateFreelancer(job.id, rating);
    setShowRating(false);
  };

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-700 ${
      isCompleted ? "border-emerald-800/40" :
      isAssigned  ? "border-amber-800/40"   :
      isCancelled ? "border-red-800/40"     :
                    "border-gray-800"
    }`}>

      {/* ── Header ── */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-relaxed line-clamp-2">
              {job.description}
            </p>
            <p className="text-gray-600 text-xs mt-1 font-mono">Job #{job.id}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">Total</p>
            <p className="text-white font-bold text-sm">{parseFloat(job.totalPayment).toFixed(4)}</p>
            <p className="text-gray-600 text-xs">ETH</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">Released</p>
            <p className="text-emerald-400 font-bold text-sm">{parseFloat(job.amountReleased).toFixed(4)}</p>
            <p className="text-gray-600 text-xs">ETH</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">Remaining</p>
            <p className="text-violet-400 font-bold text-sm">{amountRemaining}</p>
            <p className="text-gray-600 text-xs">ETH</p>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <MilestoneProgress
          completed={job.milestonesCompleted || 0}
          total={job.milestones || 0}
        />
      </div>

      {/* ── Milestone Deadlines ── */}
      {job.deadlines && job.deadlines.length > 0 && (
        <div className="px-5 pb-4">
          <MilestoneDeadlines
            deadlines={job.deadlines}
            milestonesCompleted={job.milestonesCompleted || 0}
          />
        </div>
      )}

      {/* ── Freelancer Profile ── */}
      {hasFreelancer && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
            Freelancer
          </p>
          <FreelancerInfo address={job.freelancer} />
        </div>
      )}

      {/* ── Final Rating (logs view) ── */}
      {showLogs && job.rating > 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Final Rating</p>
          <StarRating value={job.rating} />
        </div>
      )}

      {/* ── Rate Freelancer (client, completed, active view) ── */}
      {isCompleted && isClient && !showLogs && (
        <div className="px-5 pb-4">
          {!showRating ? (
            <button
              onClick={() => setShowRating(true)}
              className="w-full py-2 border border-amber-700/40 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-900/20 transition-colors"
            >
              ⭐ Rate Freelancer
            </button>
          ) : (
            <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
              <p className="text-sm text-gray-300 mb-3 font-medium">Rate this freelancer</p>
              <StarRating value={rating} interactive onChange={setRating} />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleRate}
                  disabled={rating === 0}
                  className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-500 disabled:opacity-40 transition-colors"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowRating(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Action Buttons ── */}
      {!showLogs && !isFinished && (
        <div className="px-5 pb-5 flex flex-wrap gap-2">

          {/* Accept Job */}
          {isOpen && !isClient && (
            <ActionButton onClick={() => actions.acceptJob(job.id)} color="blue" icon="✓">
              Accept Job
            </ActionButton>
          )}

          {/* Submit Work */}
          {isAssigned && isFreelancer && !workSubmitted && (
            <ActionButton onClick={() => actions.submitWork(job.id)} color="violet" icon="↑">
              Submit Work
            </ActionButton>
          )}

          {/* Awaiting approval */}
          {isAssigned && isFreelancer && workSubmitted && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-amber-400 border border-amber-700/40 bg-amber-900/20">
              ⏳ Awaiting client approval
            </span>
          )}

          {/* Release Milestone */}
          {isAssigned && isClient && workSubmitted && (
            <ActionButton onClick={() => actions.releaseMilestone(job.id)} color="emerald" icon="$">
              Release Milestone
            </ActionButton>
          )}

          {/* Remove Freelancer */}
          {isAssigned && isClient && !workSubmitted && (
            <ActionButton onClick={() => actions.removeFreelancer(job.id)} color="red" icon="×" variant="ghost">
              Remove Freelancer
            </ActionButton>
          )}

          {/* Delete Job (open, no freelancer yet) */}
          {isOpen && isClient && (
            <ActionButton
              onClick={() => window.confirm("Cancel this job and get your ETH refunded?") && actions.cancelJob(job.id)}
              color="red" icon="🗑" variant="ghost"
            >
              Delete Job
            </ActionButton>
          )}

          {/* Cancel Job (assigned, work not yet submitted) */}
          {isAssigned && isClient && !workSubmitted && (
            <ActionButton
              onClick={() => window.confirm("Cancel this job? Remaining ETH will be refunded.") && actions.cancelJob(job.id)}
              color="red" icon="✕" variant="ghost"
            >
              Cancel Job
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  ActionButton
// ─────────────────────────────────────────────

function ActionButton({ onClick, color, children, variant = "solid", icon }) {
  const colors = {
    blue:    variant === "solid" ? "bg-blue-600 hover:bg-blue-500 text-white"       : "border border-blue-700/50 text-blue-400 hover:bg-blue-900/30",
    violet:  variant === "solid" ? "bg-violet-600 hover:bg-violet-500 text-white"   : "border border-violet-700/50 text-violet-400 hover:bg-violet-900/30",
    emerald: variant === "solid" ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "border border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/30",
    red:     variant === "solid" ? "bg-red-600 hover:bg-red-500 text-white"         : "border border-red-700/50 text-red-400 hover:bg-red-900/30",
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 shadow ${colors[color]}`}
    >
      <span className="text-base leading-none">{icon}</span>
      {children}
    </button>
  );
}
