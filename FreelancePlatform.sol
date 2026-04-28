// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelancePlatform {

    // ─────────────────────────────────────────────
    //  Data Structures
    // ─────────────────────────────────────────────

    struct Profile {
        string name;
        string skills;
        string bio;
    }

    struct Message {
        address sender;
        string text;
        uint timestamp;
    }

    // Status values (matches frontend STATUS map)
    // 0 = Open, 1 = Assigned, 2 = Completed, 3 = Cancelled
    enum Status { Open, Assigned, Completed, Cancelled }

    struct Job {
        uint id;
        address client;
        address freelancer;
        string description;
        uint totalPayment;
        uint milestoneCount;
        uint currentMilestone;
        uint releasedPayment;
        uint[] deadlines;
        Status status;
        bool workSubmitted;
        uint8 rating;
    }

    // ─────────────────────────────────────────────
    //  State
    // ─────────────────────────────────────────────

    uint public jobCount;

    mapping(uint => Job) private _jobs;
    mapping(address => Profile) private _profiles;
    mapping(uint => Message[]) public chats;

    // ─────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────

    event ProfileCreated(address indexed user, string name);
    event JobPosted(uint indexed jobId, address indexed client, uint payment);
    event JobAccepted(uint indexed jobId, address indexed freelancer);
    event WorkSubmitted(uint indexed jobId);
    event MilestoneReleased(uint indexed jobId, uint milestone, uint amount);
    event JobCompleted(uint indexed jobId);
    event JobCancelled(uint indexed jobId);
    event FreelancerRemoved(uint indexed jobId);
    event FreelancerRated(uint indexed jobId, uint8 rating);
    event MessageSent(uint indexed jobId, address indexed sender);

    // ─────────────────────────────────────────────
    //  Profile
    // ─────────────────────────────────────────────

    function createProfile(
        string memory _name,
        string memory _skills,
        string memory _bio
    ) public {
        require(bytes(_name).length > 0, "Name required");
        _profiles[msg.sender] = Profile(_name, _skills, _bio);
        emit ProfileCreated(msg.sender, _name);
    }

    /// @notice Returns the profile for any address.
    function getProfile(address user)
        public
        view
        returns (string memory name, string memory skills, string memory bio)
    {
        Profile storage p = _profiles[user];
        return (p.name, p.skills, p.bio);
    }

    // ─────────────────────────────────────────────
    //  Jobs
    // ─────────────────────────────────────────────

    function postJob(
        string memory _desc,
        uint _milestones,
        uint[] memory _deadlines
    ) public payable {
        require(msg.value > 0, "Payment required");
        require(_milestones > 0, "At least one milestone");
        require(_milestones <= 20, "Too many milestones");
        require(_deadlines.length == _milestones, "Deadline count mismatch");
        require(bytes(_desc).length > 0, "Description required");

        jobCount++;

        _jobs[jobCount] = Job({
            id: jobCount,
            client: msg.sender,
            freelancer: address(0),
            description: _desc,
            totalPayment: msg.value,
            milestoneCount: _milestones,
            currentMilestone: 0,
            releasedPayment: 0,
            deadlines: _deadlines,
            status: Status.Open,
            workSubmitted: false,
            rating: 0
        });

        emit JobPosted(jobCount, msg.sender, msg.value);
    }

    /// @notice Returns all fields needed by the frontend for a job.
    function getJob(uint _jobId)
        public
        view
        returns (
            string memory description,
            address client,
            address freelancer,
            uint totalPayment,
            uint amountReleased,
            uint milestones,
            uint milestonesCompleted,
            uint8 status,
            uint8 rating,
            uint[] memory deadlines,
            bool workSubmitted
        )
    {
        Job storage j = _jobs[_jobId];
        return (
            j.description,
            j.client,
            j.freelancer,
            j.totalPayment,
            j.releasedPayment,
            j.milestoneCount,
            j.currentMilestone,
            uint8(j.status),
            j.rating,
            j.deadlines,
            j.workSubmitted
        );
    }

    // ─────────────────────────────────────────────
    //  Job Actions
    // ─────────────────────────────────────────────

    function acceptJob(uint _jobId) public {
        Job storage job = _jobs[_jobId];
        require(job.id != 0, "Job not found");
        require(job.status == Status.Open, "Job not open");
        require(msg.sender != job.client, "Client cannot self-accept");

        job.freelancer = msg.sender;
        job.status = Status.Assigned;
        emit JobAccepted(_jobId, msg.sender);
    }

    function submitWork(uint _jobId) public {
        Job storage job = _jobs[_jobId];
        require(job.status == Status.Assigned, "Job not assigned");
        require(msg.sender == job.freelancer, "Only freelancer");
        require(!job.workSubmitted, "Work already submitted");

        job.workSubmitted = true;
        emit WorkSubmitted(_jobId);
    }

    function removeFreelancer(uint _jobId) public {
        Job storage job = _jobs[_jobId];
        require(msg.sender == job.client, "Only client");
        require(job.status == Status.Assigned, "Job not assigned");
        require(!job.workSubmitted, "Work already submitted");

        job.freelancer = address(0);
        job.status = Status.Open;
        emit FreelancerRemoved(_jobId);
    }

    /// @notice Client approves work and releases milestone payment.
    ///         If the freelancer missed the deadline a 10 % penalty applies.
    ///         Unspent penalty is refunded to the client on the final milestone.
    function releaseMilestone(uint _jobId) public {
        Job storage job = _jobs[_jobId];
        require(msg.sender == job.client, "Only client");
        require(job.status == Status.Assigned, "Job not assigned");
        require(job.workSubmitted, "Work not submitted yet");
        require(job.currentMilestone < job.milestoneCount, "All milestones done");

        uint baseAmount = job.totalPayment / job.milestoneCount;
        uint amount = baseAmount;

        // 10 % late penalty
        if (block.timestamp > job.deadlines[job.currentMilestone]) {
            amount = (amount * 90) / 100;
        }

        job.currentMilestone++;
        job.releasedPayment += amount;
        job.workSubmitted = false;

        bool isFinal = (job.currentMilestone == job.milestoneCount);
        if (isFinal) {
            job.status = Status.Completed;
            // Refund any unspent escrow (e.g. accumulated late penalties)
            uint leftover = job.totalPayment - job.releasedPayment;
            if (leftover > 0) {
                (bool refund, ) = payable(job.client).call{value: leftover}("");
                require(refund, "Client refund failed");
            }
            emit JobCompleted(_jobId);
        }

        (bool success, ) = payable(job.freelancer).call{value: amount}("");
        require(success, "Payment failed");

        emit MilestoneReleased(_jobId, job.currentMilestone, amount);
    }

    /// @notice Client can cancel an Open or Assigned job (before any work is submitted).
    ///         Full escrow is returned.
    function cancelJob(uint _jobId) public {
        Job storage job = _jobs[_jobId];
        require(msg.sender == job.client, "Only client");
        require(
            job.status == Status.Open || job.status == Status.Assigned,
            "Cannot cancel"
        );
        require(!job.workSubmitted, "Work already submitted");

        job.status = Status.Cancelled;

        uint refundable = job.totalPayment - job.releasedPayment;
        if (refundable > 0) {
            (bool success, ) = payable(job.client).call{value: refundable}("");
            require(success, "Refund failed");
        }

        emit JobCancelled(_jobId);
    }

    function rateFreelancer(uint _jobId, uint8 _rating) public {
        Job storage job = _jobs[_jobId];
        require(msg.sender == job.client, "Only client");
        require(job.status == Status.Completed, "Job not completed");
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(job.rating == 0, "Already rated");

        job.rating = _rating;
        emit FreelancerRated(_jobId, _rating);
    }

    // ─────────────────────────────────────────────
    //  Chat
    // ─────────────────────────────────────────────

    function sendMessage(uint _jobId, string memory _text) public {
        Job storage job = _jobs[_jobId];
        require(job.id != 0, "Job not found");
        require(
            msg.sender == job.client || msg.sender == job.freelancer,
            "Not a party to this job"
        );
        require(bytes(_text).length > 0, "Empty message");

        chats[_jobId].push(Message(msg.sender, _text, block.timestamp));
        emit MessageSent(_jobId, msg.sender);
    }

    function getMessages(uint _jobId) public view returns (Message[] memory) {
        Job storage job = _jobs[_jobId];
        require(
            msg.sender == job.client || msg.sender == job.freelancer,
            "Not a party to this job"
        );
        return chats[_jobId];
    }
}
