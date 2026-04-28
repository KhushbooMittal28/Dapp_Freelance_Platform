import React, { useState, useEffect } from "react";

function SkillBadge({ skill }) {
  return (
    <span className="px-3 py-1 bg-violet-900/40 border border-violet-700/40 text-violet-300 rounded-full text-xs font-medium">
      {skill.trim()}
    </span>
  );
}

function ProfileCard({ profile, account }) {
  const shortAddr = `${account.slice(0, 6)}…${account.slice(-4)}`;
  const skills = profile.skills ? profile.skills.split(",") : [];
  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : "?";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-violet-900/60 via-indigo-900/60 to-purple-900/60 relative">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 50%, #4f46e5 0%, transparent 50%)" }} />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 border-4 border-gray-900 flex items-center justify-center text-2xl font-black text-white shadow-xl">
            {initials}
          </div>
          <span className="px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/30 rounded-lg text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Verified
          </span>
        </div>

        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
        <p className="text-gray-500 text-sm font-mono mt-0.5">{shortAddr}</p>

        {profile.bio && (
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">{profile.bio}</p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((s, i) => s.trim() && <SkillBadge key={i} skill={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfileSection({ profile, onSave, loading, account }) {
  const [form, setForm] = useState({ name: "", skills: "", bio: "" });
  const [editing, setEditing] = useState(!profile);

  useEffect(() => {
    if (profile) {
      setForm(profile);
      setEditing(false);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Your Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Stored on-chain for employers to discover you</p>
        </div>
        {profile && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {profile && !editing && <ProfileCard profile={profile} account={account} />}

      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">{profile ? "Update Profile" : "Create Profile"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Alex Johnson"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Skills</label>
              <input
                type="text"
                required
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="e.g. Solidity, React, Node.js"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              />
              <p className="text-gray-600 text-xs mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell clients about your experience and what you do best…"
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? "Saving…" : profile ? "Update Profile" : "Create Profile"}
              </button>
              {profile && (
                <button
                  type="button"
                  onClick={() => { setForm(profile); setEditing(false); }}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
