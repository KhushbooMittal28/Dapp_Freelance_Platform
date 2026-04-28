import React, { useState } from "react";
import JobCard from "./JobCard";

const FILTERS = ["All", "Open", "Assigned", "My Jobs"];

export default function JobList({ jobs, account, loading, actions, onRefresh }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((job) => {
    const matchSearch = job.description?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "Open") return job.status === 0;
    if (filter === "Assigned") return job.status === 1;
    if (filter === "My Jobs") {
      return (
        job.client?.toLowerCase() === account?.toLowerCase() ||
        job.freelancer?.toLowerCase() === account?.toLowerCase()
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Active Jobs</h1>
          <p className="text-gray-500 text-sm mt-0.5">{jobs.length} job{jobs.length !== 1 ? "s" : ""} on-chain</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Job Grid */}
      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              account={account}
              actions={actions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-gray-400 font-semibold mb-1">No jobs found</h3>
      <p className="text-gray-600 text-sm">
        {filter === "My Jobs"
          ? "You haven't posted or accepted any jobs yet."
          : "No jobs match this filter."}
      </p>
    </div>
  );
}
