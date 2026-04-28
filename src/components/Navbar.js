import React, { useState } from "react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "post", label: "Post Job", icon: "M12 4v16m8-8H4" },
  { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a00-7-7z" },
  { id: "logs", label: "Job Logs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
];

const NETWORK_NAMES = {
  1: "Ethereum",
  5: "Goerli",
  11155111: "Sepolia",
  137: "Polygon",
  80001: "Mumbai",
  31337: "Localhost",
};

export default function Navbar({ account, network, onConnect, onDisconnect, activeTab, onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const shortAddr = account
    ? `${account.slice(0, 6)}…${account.slice(-4)}`
    : null;

  const networkName = network ? NETWORK_NAMES[network.chainId] || `Chain ${network.chainId}` : null;

  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              FreeLance<span className="text-violet-400">.eth</span>
            </span>
          </div>

          {/* Desktop Nav Tabs */}
          {account && (
            <nav className="hidden md:flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          {/* Wallet */}
          <div className="flex items-center gap-3">
            {account ? (
              <div className="flex items-center gap-2">
                {networkName && (
                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/30 rounded-lg text-xs text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {networkName}
                  </span>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500" />
                  <span className="text-sm text-gray-200 font-mono">{shortAddr}</span>
                </div>
                <button
                  onClick={onDisconnect}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Disconnect"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/40"
              >
                Connect Wallet
              </button>
            )}

            {/* Mobile menu toggle */}
            {account && (
              <button
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && account && (
          <div className="md:hidden border-t border-gray-800 py-3 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-violet-600/20 text-violet-300"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
