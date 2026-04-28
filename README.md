# 💼 FreeLance.eth — Decentralized Freelancing DApp

A Web3-based freelancing platform where clients and freelancers interact securely using smart contracts, eliminating middlemen and ensuring trust through escrow-based payments.

Built with **React, Solidity, Ethers.js, and Tailwind CSS**, this DApp allows users to post jobs, accept work, submit deliverables, and release payments transparently on the blockchain.

---

## ✨ Features

* 🔐 Wallet Authentication (MetaMask)
* 👤 On-chain User Profiles (skills, bio, identity)
* 📌 Post Freelance Jobs with Milestones
* 🤝 Accept / Assign Jobs
* 📤 Submit Work
* 💸 Escrow-based Payment Release
* ⭐ Freelancer Rating System
* 📊 Job Dashboard (Active + Completed + Cancelled)

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Blockchain:** Solidity
* **Web3 Integration:** Ethers.js
* **Wallet:** MetaMask
* **Smart Contract Tools:** Hardhat / Remix

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KhushbooMittal28/Dapp_Freelance_Platform.git
cd Dapp_Freelance_Platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Smart Contract

Open `src/contract.js` and update:

```js
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
export const CONTRACT_ABI = [ /* paste ABI */ ];
```

---

### 4. Run the App

```bash
npm start
```

Visit: http://localhost:3000

---

## 📁 Project Structure

```
src/
├── App.js
├── contract.js
├── components/
│   ├── Navbar.js
│   ├── ProfileSection.js
│   ├── PostJobForm.js
│   ├── JobList.js
│   ├── JobCard.js
│   ├── JobLogs.js
│   └── Toast.js
```

---

## ⚙️ Smart Contract Functionalities

* Profile creation & retrieval
* Job posting with milestones
* Freelancer assignment
* Work submission
* Escrow payment release
* Rating system

---

## 🧠 Key Concept

This project uses an **Escrow-based payment model**, where funds are locked in a smart contract and only released when milestones are completed — ensuring trust between client and freelancer.

---

## ⚠️ Troubleshooting

* MetaMask not detected → Install extension
* Wrong network → Switch to correct blockchain network
* Data not loading → Verify contract address & ABI

---

## 👩‍💻 Author

**Khushboo Mittal**
GitHub: https://github.com/KhushbooMittal28

---

## 🌟 Future Improvements

* 📱 Mobile responsiveness
* 🔍 Job search & filtering
* 📦 IPFS integration for file uploads
* 🔔 Real-time notifications

---

## ⭐ If you like this project

Give it a ⭐ on GitHub — it helps!
