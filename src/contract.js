// ============================================================
// Replace CONTRACT_ADDRESS with your deployed contract address
// after deploying FreelancePlatform.sol in Remix.
// ============================================================

export const CONTRACT_ADDRESS = "0xYourContractAddressHere";

export const CONTRACT_ABI = [
  // ── Profile ──────────────────────────────────────────────
  "function createProfile(string name, string skills, string bio) external",
  "function getProfile(address user) external view returns (string name, string skills, string bio)",

  // ── Post / Query Jobs ────────────────────────────────────
  "function postJob(string description, uint256 milestones, uint256[] deadlines) external payable",
  "function jobCount() external view returns (uint256)",
  "function getJob(uint256 jobId) external view returns (string description, address client, address freelancer, uint256 totalPayment, uint256 amountReleased, uint256 milestones, uint256 milestonesCompleted, uint8 status, uint8 rating, uint256[] deadlines, bool workSubmitted)",

  // ── Job Actions ──────────────────────────────────────────
  "function acceptJob(uint256 jobId) external",
  "function submitWork(uint256 jobId) external",
  "function releaseMilestone(uint256 jobId) external",
  "function removeFreelancer(uint256 jobId) external",
  "function cancelJob(uint256 jobId) external",
  "function rateFreelancer(uint256 jobId, uint8 rating) external",

  // ── Chat ─────────────────────────────────────────────────
  "function sendMessage(uint256 jobId, string text) external",
  "function getMessages(uint256 jobId) external view returns (tuple(address sender, string text, uint256 timestamp)[] messages)",

  // ── Events ───────────────────────────────────────────────
  "event ProfileCreated(address indexed user, string name)",
  "event JobPosted(uint256 indexed jobId, address indexed client, uint256 payment)",
  "event JobAccepted(uint256 indexed jobId, address indexed freelancer)",
  "event WorkSubmitted(uint256 indexed jobId)",
  "event MilestoneReleased(uint256 indexed jobId, uint256 milestone, uint256 amount)",
  "event JobCompleted(uint256 indexed jobId)",
  "event JobCancelled(uint256 indexed jobId)",
  "event FreelancerRemoved(uint256 indexed jobId)",
  "event FreelancerRated(uint256 indexed jobId, uint8 rating)",
  "event MessageSent(uint256 indexed jobId, address indexed sender)",
];
