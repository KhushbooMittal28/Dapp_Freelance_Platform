import React, { useState } from "react";

const MILESTONE_MAX = 10;

export default function PostJobForm({ onSubmit, loading }) {
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState(1);
  const [deadlines, setDeadlines] = useState([""]);
  const [payment, setPayment] = useState("");

  const handleMilestonesChange = (val) => {
    const n = Math.min(Math.max(1, parseInt(val) || 1), MILESTONE_MAX);
    setMilestones(n);
    setDeadlines((prev) => {
      const arr = [...prev];
      while (arr.length < n) arr.push("");
      return arr.slice(0, n);
    });
  };

  const handleDeadlineChange = (idx, val) => {
    setDeadlines((prev) => {
      const arr = [...prev];
      arr[idx] = val;
      return arr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all deadlines are filled and in the future
    const now = Date.now();
    for (let i = 0; i < deadlines.length; i++) {
      if (!deadlines[i]) {
        alert(`Please set a deadline for Milestone ${i + 1}`);
        return;
      }
      if (new Date(deadlines[i]).getTime() <= now) {
        alert(`Deadline for Milestone ${i + 1} must be in the future`);
        return;
      }
    }
    const deadlineTimestamps = deadlines.map((d) =>
      Math.floor(new Date(d).getTime() / 1000)
    );
    await onSubmit({ description, milestones, deadlines: deadlineTimestamps, payment });
    // Reset form on success
    setDescription("");
    setMilestones(1);
    setDeadlines([""]);
    setPayment("");
  };

  const paymentUSD = payment ? (parseFloat(payment) * 3200).toFixed(0) : null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Post a Job</h1>
        <p className="text-gray-500 text-sm mt-0.5">Funds are locked in escrow until milestones are approved</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Job Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the project, requirements, deliverables, and any relevant context…"
            rows={5}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors resize-none"
          />
        </div>

        {/* Payment */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Total Payment (ETH)</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
              <span className="text-gray-500 text-sm">ETH</span>
            </div>
            <input
              type="number"
              step="0.001"
              min="0"
              required
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-20 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>
          {paymentUSD && (
            <p className="text-gray-600 text-xs mt-1">≈ ${paymentUSD} USD</p>
          )}
        </div>

        {/* Milestones */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Number of Milestones
            <span className="ml-2 text-gray-600 font-normal">(max {MILESTONE_MAX})</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleMilestonesChange(milestones - 1)}
              className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max={MILESTONE_MAX}
              value={milestones}
              onChange={(e) => handleMilestonesChange(e.target.value)}
              className="w-20 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => handleMilestonesChange(milestones + 1)}
              className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              +
            </button>
            {payment && milestones > 0 && (
              <span className="text-gray-500 text-sm ml-2">
                ≈ {(parseFloat(payment) / milestones).toFixed(4)} ETH per milestone
              </span>
            )}
          </div>
        </div>

        {/* Deadlines */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Milestone Deadlines</label>
          <div className="space-y-2">
            {deadlines.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24 flex-shrink-0">Milestone {i + 1}</span>
                <input
                  type="date"
                  value={d}
                  min={today}
                  onChange={(e) => handleDeadlineChange(i, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 bg-violet-900/20 border border-violet-700/30 rounded-xl p-4">
          <svg className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-violet-300 text-sm leading-relaxed">
            Your payment of <strong>{payment || "0"} ETH</strong> will be locked in the smart contract. Funds are released automatically as milestones are approved.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !description || !payment}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-bold text-base hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-900/40 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Posting to Blockchain…
            </span>
          ) : (
            "Post Job & Lock Funds"
          )}
        </button>
      </div>
    </div>
  );
}
