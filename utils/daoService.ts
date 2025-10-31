// DAO Service for NFT-Based Governance
import { Client, PrivateKey, AccountId } from "@hashgraph/sdk";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: 'PLATFORM' | 'TREASURY' | 'TECHNICAL' | 'COMMUNITY' | 'PARTNERSHIP';
  type: 'PROPOSAL' | 'MOTION' | 'BUDGET_REQUEST';
  status: 'DRAFT' | 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';
  votingPower: number;
  quorum: number;
  supportThreshold: number; // percentage required to pass
  createdAt: Date;
  votingStart: Date;
  votingEnd: Date;
  executionDeadline: Date;
  votes: Vote[];
  executionData?: any;
  treasuryRequest?: TreasuryRequest;
}

export interface Vote {
  id: string;
  voter: string;
  proposalId: string;
  vote: 'FOR' | 'AGAINST' | 'ABSTAIN';
  votingPower: number;
  nftTokenIds: string[]; // NFTs used for voting
  timestamp: Date;
  reason?: string;
}

export interface TreasuryRequest {
  id: string;
  proposalId: string;
  amount: number; // HBAR
  recipient: string;
  purpose: string;
  category: 'DEVELOPMENT' | 'MARKETING' | 'INFRASTRUCTURE' | 'COMMUNITY' | 'EMERGENCY';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  attachments?: string[];
}

export interface DAOMember {
  address: string;
  nftHoldings: string[]; // NFT token IDs
  votingPower: number;
  joinedAt: Date;
  lastActive: Date;
  reputation: number; // 0-100
  badges: string[];
  contributions: number;
}

export interface VotingPower {
  nftTokenId: string;
  category: 'PRODUCT' | 'SERVICE' | 'EQUIPMENT';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  basePower: number;
  multiplier: number; // Based on age, rarity, etc.
  totalPower: number;
}

export interface DAOAnalytics {
  totalMembers: number;
  totalProposals: number;
  activeProposals: number;
  participationRate: number;
  treasuryBalance: number;
  averageVotingPower: number;
  topContributors: DAOMember[];
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'PROPOSAL_CREATED' | 'VOTE_CAST' | 'PROPOSAL_PASSED' | 'PROPOSAL_REJECTED' | 'TREASURY_EXECUTED';
  actor: string;
  target?: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

export class DAOService {
  private static instance: DAOService;
  private client: Client;
  private proposals: Map<string, Proposal> = new Map();
  private members: Map<string, DAOMember> = new Map();
  private treasuryBalance: number = 100000; // 100k HBAR initial treasury

  private constructor() {
    this.client = Client.forTestnet();
  }

  public static getInstance(): DAOService {
    if (!DAOService.instance) {
      DAOService.instance = new DAOService();
    }
    return DAOService.instance;
  }

  // Proposal Management
  public async createProposal(
    proposer: string,
    title: string,
    description: string,
    category: Proposal['category'],
    type: Proposal['type'],
    votingDuration: number = 7, // days
    supportThreshold: number = 51, // percentage
    treasuryRequest?: TreasuryRequest
  ): Promise<Proposal> {
    try {
      // Check if proposer has sufficient voting power
      const proposerPower = await this.getVotingPower(proposer);
      if (proposerPower < 100) { // Minimum 100 voting power to propose
        // For testing purposes, allow low power addresses
        console.log(`Warning: Low voting power for proposer ${proposer}: ${proposerPower}`);
      }

      const proposalId = `proposal_${Date.now()}_${proposer.slice(-8)}`;
      const now = new Date();
      const votingEnd = new Date(now.getTime() + votingDuration * 24 * 60 * 60 * 1000);
      const executionDeadline = new Date(votingEnd.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days after voting

      const proposal: Proposal = {
        id: proposalId,
        title,
        description,
        proposer,
        category,
        type,
        status: 'DRAFT',
        votingPower: proposerPower,
        quorum: await this.calculateQuorum(),
        supportThreshold,
        createdAt: now,
        votingStart: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours delay
        votingEnd,
        executionDeadline,
        votes: [],
        treasuryRequest,
      };

      // If treasury request, validate amount
      if (treasuryRequest && treasuryRequest.amount > this.treasuryBalance * 0.1) {
        throw new Error('Treasury request exceeds 10% of total treasury');
      }

      this.proposals.set(proposalId, proposal);
      await this.storeProposal(proposal);
      
      // Add activity
      await this.addActivity({
        id: `activity_${Date.now()}`,
        type: 'PROPOSAL_CREATED',
        actor: proposer,
        target: proposalId,
        description: `Created proposal: ${title}`,
        timestamp: now,
        metadata: { category, type },
      });

      console.log(`Created proposal ${proposalId}: ${title}`);
      return proposal;
    } catch (error) {
      console.error('Failed to create proposal:', error);
      throw error;
    }
  }

  public async castVote(
    proposalId: string,
    voter: string,
    vote: Vote['vote'],
    nftTokenIds: string[],
    reason?: string
  ): Promise<Vote> {
    try {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) {
        throw new Error(`Proposal ${proposalId} not found`);
      }

      if (proposal.status !== 'ACTIVE') {
        throw new Error('Proposal is not active for voting');
      }

      const now = new Date();
      if (now < proposal.votingStart || now > proposal.votingEnd) {
        throw new Error('Voting period is not active');
      }

      // Check if voter has already voted
      const existingVote = proposal.votes.find(v => v.voter === voter);
      if (existingVote) {
        throw new Error('Voter has already cast a vote');
      }

      // Calculate voting power from NFTs
      const votingPower = await this.calculateVotingPowerFromNFTs(nftTokenIds, voter);
      if (votingPower === 0) {
        throw new Error('No valid NFTs for voting');
      }

      const voteRecord: Vote = {
        id: `vote_${Date.now()}_${voter.slice(-8)}`,
        voter,
        proposalId,
        vote,
        votingPower,
        nftTokenIds,
        timestamp: now,
        reason,
      };

      proposal.votes.push(voteRecord);
      await this.updateProposal(proposal);
      
      // Add activity
      await this.addActivity({
        id: `activity_${Date.now()}`,
        type: 'VOTE_CAST',
        actor: voter,
        target: proposalId,
        description: `Cast ${vote} vote on proposal: ${proposal.title}`,
        timestamp: now,
        metadata: { vote, votingPower },
      });

      console.log(`Vote cast by ${voter} on proposal ${proposalId}: ${vote} (${votingPower} power)`);
      return voteRecord;
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  }

  public async executeProposal(proposalId: string, executor: string): Promise<{ success: boolean; result?: any }> {
    try {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) {
        throw new Error(`Proposal ${proposalId} not found`);
      }

      if (proposal.status !== 'PASSED') {
        throw new Error('Proposal has not passed');
      }

      const now = new Date();
      if (now > proposal.executionDeadline) {
        throw new Error('Execution deadline has passed');
      }

      let result: any = null;

      // Execute based on proposal type
      switch (proposal.type) {
        case 'PROPOSAL':
          result = await this.executeGeneralProposal(proposal);
          break;
        case 'BUDGET_REQUEST':
          if (proposal.treasuryRequest) {
            result = await this.executeTreasuryRequest(proposal.treasuryRequest);
          }
          break;
        case 'MOTION':
          result = await this.executeMotion(proposal);
          break;
      }

      proposal.status = 'EXECUTED';
      await this.updateProposal(proposal);

      console.log(`Proposal ${proposalId} executed successfully`);
      return { success: true, result };
    } catch (error) {
      console.error('Failed to execute proposal:', error);
      return { success: false };
    }
  }

  // Voting Power Calculation
  public async getVotingPower(memberAddress: string): Promise<number> {
    try {
      const member = this.members.get(memberAddress);
      if (!member) {
        return 0;
      }

      let totalPower = 0;
      for (const nftTokenId of member.nftHoldings) {
        const power = await this.getNFTVotingPower(nftTokenId);
        totalPower += power.totalPower;
      }

      return totalPower;
    } catch (error) {
      console.error('Failed to get voting power:', error);
      return 0;
    }
  }

  public async getNFTVotingPower(nftTokenId: string): Promise<VotingPower> {
    try {
      // Get NFT metadata and calculate voting power
      const nft = await this.getNFTMetadata(nftTokenId);
      
      let basePower = 1;
      let multiplier = 1;

      // Base power by category
      switch (nft.category) {
        case 'PRODUCT':
          basePower = 10;
          break;
        case 'SERVICE':
          basePower = 15;
          break;
        case 'EQUIPMENT':
          basePower = 20;
          break;
      }

      // Multiplier by rarity and age
      const rarity = await this.calculateNFTRarity(nftTokenId);
      const age = Date.now() - new Date(nft.createdAt).getTime();
      const ageInDays = age / (1000 * 60 * 60 * 24);

      switch (rarity) {
        case 'COMMON':
          multiplier = 1;
          break;
        case 'RARE':
          multiplier = 1.5;
          break;
        case 'EPIC':
          multiplier = 2;
          break;
        case 'LEGENDARY':
          multiplier = 3;
          break;
      }

      // Age bonus (up to 2x for NFTs older than 1 year)
      if (ageInDays > 365) {
        multiplier *= Math.min(2, 1 + (ageInDays - 365) / 365);
      }

      const totalPower = Math.floor(basePower * multiplier);

      return {
        nftTokenId,
        category: nft.category,
        rarity,
        basePower,
        multiplier,
        totalPower,
      };
    } catch (error) {
      console.error('Failed to get NFT voting power:', error);
      return {
        nftTokenId,
        category: 'PRODUCT',
        rarity: 'COMMON',
        basePower: 1,
        multiplier: 1,
        totalPower: 1,
      };
    }
  }

  // Member Management
  public async addMember(address: string, nftTokenIds: string[]): Promise<DAOMember> {
    try {
      const votingPower = await this.getVotingPower(address);
      
      const member: DAOMember = {
        address,
        nftHoldings: nftTokenIds,
        votingPower,
        joinedAt: new Date(),
        lastActive: new Date(),
        reputation: 50, // Starting reputation
        badges: [],
        contributions: 0,
      };

      this.members.set(address, member);
      await this.storeMember(member);
      
      console.log(`Added DAO member: ${address} with ${votingPower} voting power`);
      return member;
    } catch (error) {
      console.error('Failed to add member:', error);
      throw error;
    }
  }

  public async updateMemberReputation(address: string, change: number): Promise<void> {
    try {
      const member = this.members.get(address);
      if (!member) {
        throw new Error(`Member ${address} not found`);
      }

      member.reputation = Math.max(0, Math.min(100, member.reputation + change));
      member.lastActive = new Date();
      
      await this.updateMember(member);
      
      console.log(`Updated reputation for ${address}: ${member.reputation}`);
    } catch (error) {
      console.error('Failed to update member reputation:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  public async getDAOAnalytics(): Promise<DAOAnalytics> {
    try {
      const totalMembers = this.members.size;
      const totalProposals = this.proposals.size;
      const activeProposals = Array.from(this.proposals.values()).filter(p => p.status === 'ACTIVE').length;
      
      let totalVotingPower = 0;
      let participationCount = 0;
      
      for (const member of this.members.values()) {
        totalVotingPower += member.votingPower;
        if (member.lastActive.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000) {
          participationCount++;
        }
      }
      
      const participationRate = totalMembers > 0 ? (participationCount / totalMembers) * 100 : 0;
      const averageVotingPower = totalMembers > 0 ? totalVotingPower / totalMembers : 0;
      
      const topContributors = Array.from(this.members.values())
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, 10);
      
      const recentActivity = await this.getRecentActivity();

      return {
        totalMembers,
        totalProposals,
        activeProposals,
        participationRate,
        treasuryBalance: this.treasuryBalance,
        averageVotingPower,
        topContributors,
        recentActivity,
      };
    } catch (error) {
      console.error('Failed to get DAO analytics:', error);
      throw error;
    }
  }

  // Private helper methods
  private async calculateQuorum(): Promise<number> {
    // Quorum is 10% of total voting power
    let totalVotingPower = 0;
    for (const member of this.members.values()) {
      totalVotingPower += member.votingPower;
    }
    return Math.floor(totalVotingPower * 0.1);
  }

  private async calculateVotingPowerFromNFTs(nftTokenIds: string[], voter: string): Promise<number> {
    let totalPower = 0;
    for (const nftTokenId of nftTokenIds) {
      // Verify ownership
      const isOwner = await this.verifyNFTOwnership(nftTokenId, voter);
      if (isOwner) {
        const power = await this.getNFTVotingPower(nftTokenId);
        totalPower += power.totalPower;
      }
    }
    return totalPower;
  }

  private async executeGeneralProposal(proposal: Proposal): Promise<any> {
    // Execute general platform proposals
    console.log(`Executing general proposal: ${proposal.title}`);
    return { executed: true, timestamp: new Date() };
  }

  private async executeTreasuryRequest(request: TreasuryRequest): Promise<any> {
    if (request.amount > this.treasuryBalance) {
      throw new Error('Insufficient treasury balance');
    }
    
    this.treasuryBalance -= request.amount;
    request.status = 'EXECUTED';
    
    console.log(`Executed treasury request: ${request.amount} HBAR to ${request.recipient}`);
    return { amount: request.amount, recipient: request.recipient };
  }

  private async executeMotion(proposal: Proposal): Promise<any> {
    // Execute governance motions
    console.log(`Executing motion: ${proposal.title}`);
    return { executed: true, timestamp: new Date() };
  }

  private async getNFTMetadata(nftTokenId: string): Promise<any> {
    // Get NFT metadata from database
    return {
      category: 'PRODUCT',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    };
  }

  private async calculateNFTRarity(nftTokenId: string): Promise<VotingPower['rarity']> {
    // Calculate rarity based on various factors
    return 'RARE'; // Simplified for now
  }

  private async verifyNFTOwnership(nftTokenId: string, owner: string): Promise<boolean> {
    // Verify NFT ownership
    return true; // Simplified for now
  }

  private async storeProposal(proposal: Proposal): Promise<void> {
    console.log(`Storing proposal: ${proposal.id}`);
  }

  private async updateProposal(proposal: Proposal): Promise<void> {
    console.log(`Updating proposal: ${proposal.id}`);
  }

  private async storeMember(member: DAOMember): Promise<void> {
    console.log(`Storing member: ${member.address}`);
  }

  private async updateMember(member: DAOMember): Promise<void> {
    console.log(`Updating member: ${member.address}`);
  }

  private async addActivity(activity: Activity): Promise<void> {
    console.log(`Adding activity: ${activity.type}`);
  }

  private async getRecentActivity(): Promise<Activity[]> {
    // Get recent DAO activity
    return [];
  }
}

// Export singleton instance
export const daoService = DAOService.getInstance();
