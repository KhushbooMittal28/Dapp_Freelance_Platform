import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import ProfileSection from "./components/ProfileSection";
import PostJobForm from "./components/PostJobForm";
import JobList from "./components/JobList";
import JobLogs from "./components/JobLogs";
import Toast from "./components/Toast";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobLogs, setJobLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showToast("MetaMask not detected. Please install it.", "error");
        return;
      }
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = _provider.getSigner();
      const _account = await _signer.getAddress();
      const _network = await _provider.getNetwork();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setNetwork(_network);
      setContract(_contract);
      showToast("Wallet connected successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to connect wallet", "error");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setNetwork(null);
    setContract(null);
    setProfile(null);
    setJobs([]);
    showToast("Wallet disconnected", "info");
  };

  const fetchProfile = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const p = await contract.getProfile(account);
      if (p && p.name) {
        setProfile({ name: p.name, skills: p.skills, bio: p.bio });
      }
    } catch (err) {
      console.error("fetchProfile:", err);
    }
  }, [contract, account]);

  const createProfile = async (profileData) => {
    if (!contract) return showToast("Connect wallet first", "error");
    setLoading(true);
    try {
      const tx = await contract.createProfile(profileData.name, profileData.skills, profileData.bio);
      await tx.wait();
      setProfile(profileData);
      showToast("Profile saved on-chain!", "success");
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = useCallback(async () => {
    if (!contract) return;
    try {
      const count = await contract.jobCount();
      const total = count.toNumber();
      const fetchedJobs = [];
      const fetchedLogs = [];
      // Job IDs start at 1 (jobCount++ before assignment in contract)
      for (let i = 1; i <= total; i++) {
        const job = await contract.getJob(i);
        const statusNum = job.status?.toNumber ? job.status.toNumber() : Number(job.status);
        const jobObj = {
          id: i,
          description: job.description,
          client: job.client,
          freelancer: job.freelancer,
          totalPayment: ethers.utils.formatEther(job.totalPayment),
          amountReleased: ethers.utils.formatEther(job.amountReleased),
          milestones: job.milestones?.toNumber ? job.milestones.toNumber() : Number(job.milestones),
          milestonesCompleted: job.milestonesCompleted?.toNumber ? job.milestonesCompleted.toNumber() : Number(job.milestonesCompleted),
          status: statusNum,
          rating: job.rating?.toNumber ? job.rating.toNumber() : Number(job.rating),
          deadlines: job.deadlines,
          workSubmitted: job.workSubmitted,
        };
        if (jobObj.status === 2 || jobObj.status === 3) {
          fetchedLogs.push(jobObj);
        } else {
          fetchedJobs.push(jobObj);
        }
      }
      setJobs(fetchedJobs);
      setJobLogs(fetchedLogs);
    } catch (err) {
      console.error("fetchJobs:", err);
    }
  }, [contract]);

  const postJob = async (jobData) => {
    if (!contract) return showToast("Connect wallet first", "error");
    setLoading(true);
    try {
      const tx = await contract.postJob(
        jobData.description,
        jobData.milestones,
        jobData.deadlines,
        { value: ethers.utils.parseEther(jobData.payment) }
      );
      await tx.wait();
      showToast("Job posted on-chain!", "success");
      await fetchJobs();
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (jobId) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.acceptJob(jobId);
      await tx.wait();
      showToast("Job accepted!", "success");
      await fetchJobs();
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitWork = async (jobId) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.submitWork(jobId);
      await tx.wait();
      showToast("Work submitted!", "success");
      await fetchJobs();
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const releaseMilestone = async (jobId) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.releaseMilestone(jobId);
      await tx.wait();
      showToast("Milestone payment released!", "success");
      await fetchJobs();
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFreelancer = async (jobId) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.removeFreelancer(jobId);
      await tx.wait();
      showToast("Freelancer removed.", "info");
      await fetchJobs();
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const cancelJob = async (jobId) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.cancelJob(jobId);
      await tx.wait();
      showToast("Job cancelled. Funds refunded.", "info");
      await fetchJobs();
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const rateFreelancer = async (jobId, rating) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.rateFreelancer(jobId, rating);
      await tx.wait();
      showToast("Rating submitted!", "success");
      await fetchJobs();
    } catch (err) {
      showToast(err.reason || err.message || "Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchProfile();
      fetchJobs();
    }
  }, [contract, account, fetchProfile, fetchJobs]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) disconnectWallet();
        else connectWallet();
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contractActions = {
    postJob,
    acceptJob,
    submitWork,
    releaseMilestone,
    removeFreelancer,
    cancelJob,
    rateFreelancer,
    fetchJobs,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <Navbar
        account={account}
        network={network}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!account ? (
          <LandingHero onConnect={connectWallet} />
        ) : (
          <>
            {activeTab === "dashboard" && (
              <JobList
                jobs={jobs}
                account={account}
                loading={loading}
                actions={contractActions}
                onRefresh={fetchJobs}
              />
            )}
            {activeTab === "post" && (
              <PostJobForm onSubmit={postJob} loading={loading} />
            )}
            {activeTab === "profile" && (
              <ProfileSection
                profile={profile}
                onSave={createProfile}
                loading={loading}
                account={account}
              />
            )}
            {activeTab === "logs" && (
              <JobLogs jobs={jobLogs} account={account} actions={contractActions} />
            )}
          </>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
      {loading && <GlobalLoader />}
    </div>
  );
}

function LandingHero({ onConnect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
      <div className="mb-8 relative">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-violet-900/50">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div className="absolute -inset-4 rounded-3xl bg-violet-600/10 blur-xl -z-10" />
      </div>

      <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
        <span className="text-white">Decentralized</span>{" "}
        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Freelancing
        </span>
      </h1>
      <p className="text-gray-400 text-xl max-w-xl mb-10 leading-relaxed">
        Trustless contracts. Milestone-based payments. No middlemen. Connect your wallet to get started.
      </p>

      <button
        onClick={onConnect}
        className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-violet-900/50 hover:shadow-violet-700/60 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Connect Wallet
        </span>
      </button>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          { icon: "🔒", title: "Trustless Escrow", desc: "Funds locked in smart contracts, released on milestone completion" },
          { icon: "⚡", title: "Instant Payments", desc: "Get paid directly to your wallet, no delays or processing fees" },
          { icon: "⭐", title: "On-chain Reputation", desc: "Your ratings and history permanently recorded on the blockchain" },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-violet-700/50 transition-colors">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-white mb-1">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlobalLoader() {
  return (
    <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-6 flex items-center gap-4 shadow-2xl">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-300 font-medium">Processing transaction…</span>
      </div>
    </div>
  );
}
