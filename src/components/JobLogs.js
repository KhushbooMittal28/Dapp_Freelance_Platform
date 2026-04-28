import React from "react";
import JobCard from "./JobCard";

export default function JobLogs({ jobs, account, actions }) {
  const completed = jobs.filter((j) => j.status === 2);
  const cancelled = jobs.filter((j) => j.status === 3);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Job Logs</h1>
        <p className="text-gray-500 text-sm mt-0.5">Completed and cancelled jobs archived here</p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-gray-400 font-semibold">No archived jobs</h3>
          <p className="text-gray-600 text-sm mt-1">Completed and cancelled jobs will appear here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {completed.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 rounded-lg text-sm font-semibold">
                  ✓ Completed ({completed.length})
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completed.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    account={account}
                    actions={actions}
                    showLogs
                  />
                ))}
              </div>
            </section>
          )}

          {cancelled.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-900/30 border border-red-700/30 text-red-400 rounded-lg text-sm font-semibold">
                  ✕ Cancelled ({cancelled.length})
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {cancelled.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    account={account}
                    actions={actions}
                    showLogs
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
