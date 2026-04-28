# FreeLance.eth — Decentralized Freelancing DApp

A modern, production-grade React frontend for a Web3 decentralized freelancing platform built with Ethers.js and Tailwind CSS.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your Contract

Open `src/contract.js` and replace the placeholders:

```js
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
export const CONTRACT_ABI = [ /* paste your contract ABI here */ ];
```

> **Tip:** Your ABI is in the `artifacts/` folder after Hardhat/Truffle compilation, or copy it from Remix.

### 3. Start the Dev Server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) — connect MetaMask and you're live.

---

## 📁 File Structure

```
src/
├── App.js                  # Root component, wallet + contract logic
├── contract.js             # ← Set your address & ABI here
├── index.js
├── index.css               # Tailwind imports + custom animations
└── components/
    ├── Navbar.js           # Sticky header with wallet display & tabs
    ├── ProfileSection.js   # Create/view on-chain profile
    ├── PostJobForm.js      # Post a job with milestone deadlines
    ├── JobList.js          # Active jobs dashboard with filters
    ├── JobCard.js          # Individual job card with all actions
    ├── JobLogs.js          # Completed/cancelled job archive
    └── Toast.js            # Notification toasts
```

---

## 🎨 Design System

| Color | Meaning |
|-------|---------|
| 🟦 Blue | Open jobs |
| 🟡 Yellow/Amber | Assigned jobs |
| 🟢 Green | Completed |
| 🔴 Red | Cancelled |

**Font:** Plus Jakarta Sans  
**Theme:** Dark, minimal, Web3-native

---

## ⛓️ Smart Contract Interface

The frontend expects these functions on your contract:

```solidity
// Profile
function createProfile(string name, string skills, string bio) external;
function getProfile(address user) external view returns (string, string, string);

// Jobs
function postJob(string description, uint milestones, uint[] deadlines) external payable;
function acceptJob(uint jobId) external;
function submitWork(uint jobId) external;
function releaseMilestone(uint jobId) external;
function removeFreelancer(uint jobId) external;
function rateFreelancer(uint jobId, uint8 rating) external;

// Views
function jobCount() external view returns (uint);
function getJob(uint jobId) external view returns (...);
```

If your contract uses different function names or signatures, update them in `src/App.js` and `src/contract.js`.

---

## 🔧 Troubleshooting

**"MetaMask not detected"** — Install MetaMask browser extension.

**Transaction reverts** — Ensure you're on the correct network (match deployed contract's chain).

**Profile/Jobs not loading** — Check `CONTRACT_ADDRESS` is correct and `CONTRACT_ABI` matches your deployed contract.
