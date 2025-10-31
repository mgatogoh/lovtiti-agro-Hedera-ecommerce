// Community Service for Expert Advice and Knowledge Sharing
import { daoService } from './daoService';

export interface Expert {
  id: string;
  address: string;
  name: string;
  title: string;
  specialties: string[];
  experience: number; // years
  rating: number; // 0-5
  totalConsultations: number;
  hourlyRate: number; // HBAR
  availability: AvailabilitySlot[];
  certifications: string[];
  bio: string;
  profileImage?: string;
  verified: boolean;
  reputation: number; // 0-100
  joinedAt: Date;
  lastActive: Date;
}

export interface AvailabilitySlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isBooked: boolean;
  bookingId?: string;
}

export interface Consultation {
  id: string;
  expertId: string;
  clientId: string;
  nftTokenId?: string; // If consultation is about specific NFT
  type: 'GENERAL' | 'SPECIFIC_NFT' | 'PORTFOLIO' | 'TECHNICAL' | 'MARKET';
  subject: string;
  description: string;
  scheduledAt: Date;
  duration: number; // minutes
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  rate: number; // HBAR per hour
  totalCost: number; // HBAR
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  meetingLink?: string;
  notes?: string;
  rating?: number; // 1-5
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'TECHNICAL' | 'MARKET' | 'SUPPLY_CHAIN' | 'DEFI' | 'GOVERNANCE';
  tags: string[];
  upvotes: number;
  downvotes: number;
  replies: ForumReply[];
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  author: string;
  content: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean; // If marked as accepted answer
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedReadTime: number; // minutes
  views: number;
  likes: number;
  bookmarks: number;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityReward {
  id: string;
  recipient: string;
  type: 'CONTRIBUTION' | 'CONSULTATION' | 'KNOWLEDGE_SHARE' | 'COMMUNITY_HELP';
  amount: number; // HBAR
  reason: string;
  nftTokenId?: string; // If reward is related to specific NFT
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: Date;
  paidAt?: Date;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'WEBINAR' | 'WORKSHOP' | 'AMA' | 'CONFERENCE' | 'NETWORKING';
  organizer: string;
  speakers: string[];
  date: Date;
  duration: number; // minutes
  maxAttendees: number;
  attendees: string[];
  registrationFee: number; // HBAR
  location: string; // Physical or virtual
  meetingLink?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
}

export class CommunityService {
  private static instance: CommunityService;
  private experts: Map<string, Expert> = new Map();
  private consultations: Map<string, Consultation> = new Map();
  private forumPosts: Map<string, ForumPost> = new Map();
  private knowledgeArticles: Map<string, KnowledgeArticle> = new Map();
  private communityRewards: Map<string, CommunityReward> = new Map();
  private communityEvents: Map<string, CommunityEvent> = new Map();

  private constructor() {
    this.initializeCommunity();
  }

  public static getInstance(): CommunityService {
    if (!CommunityService.instance) {
      CommunityService.instance = new CommunityService();
    }
    return CommunityService.instance;
  }

  // Expert Management
  public async registerExpert(
    address: string,
    name: string,
    title: string,
    specialties: string[],
    experience: number,
    hourlyRate: number,
    bio: string,
    certifications: string[]
  ): Promise<Expert> {
    try {
      const expert: Expert = {
        id: `expert_${address}_${Date.now()}`,
        address,
        name,
        title,
        specialties,
        experience,
        rating: 0,
        totalConsultations: 0,
        hourlyRate,
        availability: [],
        certifications,
        bio,
        verified: false,
        reputation: 50, // Starting reputation
        joinedAt: new Date(),
        lastActive: new Date(),
      };

      this.experts.set(expert.id, expert);
      await this.storeExpert(expert);
      
      console.log(`Registered expert: ${name} (${expert.id})`);
      return expert;
    } catch (error) {
      console.error('Failed to register expert:', error);
      throw error;
    }
  }

  public async updateExpertAvailability(
    expertId: string,
    availability: AvailabilitySlot[]
  ): Promise<void> {
    try {
      const expert = this.experts.get(expertId);
      if (!expert) {
        throw new Error(`Expert ${expertId} not found`);
      }

      expert.availability = availability;
      expert.lastActive = new Date();
      
      await this.updateExpert(expert);
      
      console.log(`Updated availability for expert ${expertId}`);
    } catch (error) {
      console.error('Failed to update expert availability:', error);
      throw error;
    }
  }

  public async getAvailableExperts(
    specialty?: string,
    maxRate?: number,
    minRating?: number
  ): Promise<Expert[]> {
    try {
      let experts = Array.from(this.experts.values());

      // Filter by specialty
      if (specialty) {
        experts = experts.filter(expert => 
          expert.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
        );
      }

      // Filter by max rate
      if (maxRate) {
        experts = experts.filter(expert => expert.hourlyRate <= maxRate);
      }

      // Filter by min rating
      if (minRating) {
        experts = experts.filter(expert => expert.rating >= minRating);
      }

      // Sort by rating and availability
      experts.sort((a, b) => {
        const aAvailable = a.availability.some(slot => !slot.isBooked);
        const bAvailable = b.availability.some(slot => !slot.isBooked);
        
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
        
        return b.rating - a.rating;
      });

      return experts;
    } catch (error) {
      console.error('Failed to get available experts:', error);
      throw error;
    }
  }

  // Consultation Management
  public async bookConsultation(
    expertId: string,
    clientId: string,
    type: Consultation['type'],
    subject: string,
    description: string,
    scheduledAt: Date,
    duration: number,
    nftTokenId?: string
  ): Promise<Consultation> {
    try {
      const expert = this.experts.get(expertId);
      if (!expert) {
        throw new Error(`Expert ${expertId} not found`);
      }

      // Check availability
      const isAvailable = await this.checkExpertAvailability(expertId, scheduledAt, duration);
      if (!isAvailable) {
        throw new Error('Expert not available at requested time');
      }

      const totalCost = (expert.hourlyRate * duration) / 60;

      const consultation: Consultation = {
        id: `consultation_${Date.now()}_${clientId.slice(-8)}`,
        expertId,
        clientId,
        nftTokenId,
        type,
        subject,
        description,
        scheduledAt,
        duration,
        status: 'SCHEDULED',
        rate: expert.hourlyRate,
        totalCost,
        paymentStatus: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.consultations.set(consultation.id, consultation);
      await this.storeConsultation(consultation);
      
      // Update expert availability
      await this.markTimeSlotAsBooked(expertId, scheduledAt, duration, consultation.id);
      
      console.log(`Booked consultation ${consultation.id} with expert ${expertId}`);
      return consultation;
    } catch (error) {
      console.error('Failed to book consultation:', error);
      throw error;
    }
  }

  public async completeConsultation(
    consultationId: string,
    notes: string,
    rating: number,
    feedback: string
  ): Promise<void> {
    try {
      const consultation = this.consultations.get(consultationId);
      if (!consultation) {
        throw new Error(`Consultation ${consultationId} not found`);
      }

      consultation.status = 'COMPLETED';
      consultation.notes = notes;
      consultation.rating = rating;
      consultation.feedback = feedback;
      consultation.updatedAt = new Date();

      // Update expert stats
      const expert = this.experts.get(consultation.expertId);
      if (expert) {
        expert.totalConsultations += 1;
        expert.rating = ((expert.rating * (expert.totalConsultations - 1)) + rating) / expert.totalConsultations;
        expert.lastActive = new Date();
        await this.updateExpert(expert);
      }

      await this.updateConsultation(consultation);
      
      // Award community rewards
      await this.awardConsultationRewards(consultation);
      
      console.log(`Completed consultation ${consultationId}`);
    } catch (error) {
      console.error('Failed to complete consultation:', error);
      throw error;
    }
  }

  // Forum Management
  public async createForumPost(
    author: string,
    title: string,
    content: string,
    category: ForumPost['category'],
    tags: string[]
  ): Promise<ForumPost> {
    try {
      const post: ForumPost = {
        id: `post_${Date.now()}_${author.slice(-8)}`,
        author,
        title,
        content,
        category,
        tags,
        upvotes: 0,
        downvotes: 0,
        replies: [],
        views: 0,
        isPinned: false,
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.forumPosts.set(post.id, post);
      await this.storeForumPost(post);
      
      // Award community points for contribution
      await this.awardContributionReward(author, 'KNOWLEDGE_SHARE');
      
      console.log(`Created forum post ${post.id}: ${title}`);
      return post;
    } catch (error) {
      console.error('Failed to create forum post:', error);
      throw error;
    }
  }

  public async replyToForumPost(
    postId: string,
    author: string,
    content: string
  ): Promise<ForumReply> {
    try {
      const post = this.forumPosts.get(postId);
      if (!post) {
        throw new Error(`Forum post ${postId} not found`);
      }

      const reply: ForumReply = {
        id: `reply_${Date.now()}_${author.slice(-8)}`,
        postId,
        author,
        content,
        upvotes: 0,
        downvotes: 0,
        isAccepted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      post.replies.push(reply);
      post.updatedAt = new Date();
      
      await this.updateForumPost(post);
      
      // Award community points for helpful reply
      await this.awardContributionReward(author, 'COMMUNITY_HELP');
      
      console.log(`Added reply to forum post ${postId}`);
      return reply;
    } catch (error) {
      console.error('Failed to reply to forum post:', error);
      throw error;
    }
  }

  public async voteOnForumContent(
    contentId: string,
    voter: string,
    voteType: 'UPVOTE' | 'DOWNVOTE',
    contentType: 'POST' | 'REPLY'
  ): Promise<void> {
    try {
      if (contentType === 'POST') {
        const post = this.forumPosts.get(contentId);
        if (!post) {
          throw new Error(`Forum post ${contentId} not found`);
        }

        if (voteType === 'UPVOTE') {
          post.upvotes += 1;
        } else {
          post.downvotes += 1;
        }

        await this.updateForumPost(post);
      } else {
        // Handle reply voting
        for (const post of this.forumPosts.values()) {
          const reply = post.replies.find(r => r.id === contentId);
          if (reply) {
            if (voteType === 'UPVOTE') {
              reply.upvotes += 1;
            } else {
              reply.downvotes += 1;
            }
            await this.updateForumPost(post);
            break;
          }
        }
      }

      console.log(`${voter} voted ${voteType} on ${contentType} ${contentId}`);
    } catch (error) {
      console.error('Failed to vote on forum content:', error);
      throw error;
    }
  }

  // Knowledge Base Management
  public async createKnowledgeArticle(
    author: string,
    title: string,
    content: string,
    category: string,
    tags: string[],
    difficulty: KnowledgeArticle['difficulty'],
    estimatedReadTime: number
  ): Promise<KnowledgeArticle> {
    try {
      const article: KnowledgeArticle = {
        id: `article_${Date.now()}_${author.slice(-8)}`,
        title,
        content,
        author,
        category,
        tags,
        difficulty,
        estimatedReadTime,
        views: 0,
        likes: 0,
        bookmarks: 0,
        isFeatured: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.knowledgeArticles.set(article.id, article);
      await this.storeKnowledgeArticle(article);
      
      // Award community points for knowledge sharing
      await this.awardContributionReward(author, 'KNOWLEDGE_SHARE');
      
      console.log(`Created knowledge article ${article.id}: ${title}`);
      return article;
    } catch (error) {
      console.error('Failed to create knowledge article:', error);
      throw error;
    }
  }

  public async getKnowledgeArticles(
    category?: string,
    difficulty?: string,
    tags?: string[]
  ): Promise<KnowledgeArticle[]> {
    try {
      let articles = Array.from(this.knowledgeArticles.values());

      // Filter by category
      if (category) {
        articles = articles.filter(article => article.category === category);
      }

      // Filter by difficulty
      if (difficulty) {
        articles = articles.filter(article => article.difficulty === difficulty);
      }

      // Filter by tags
      if (tags && tags.length > 0) {
        articles = articles.filter(article => 
          tags.some(tag => article.tags.includes(tag))
        );
      }

      // Sort by views and likes
      articles.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));

      return articles;
    } catch (error) {
      console.error('Failed to get knowledge articles:', error);
      throw error;
    }
  }

  // Community Events
  public async createCommunityEvent(
    organizer: string,
    title: string,
    description: string,
    type: CommunityEvent['type'],
    date: Date,
    duration: number,
    maxAttendees: number,
    registrationFee: number,
    location: string,
    speakers: string[]
  ): Promise<CommunityEvent> {
    try {
      const event: CommunityEvent = {
        id: `event_${Date.now()}_${organizer.slice(-8)}`,
        title,
        description,
        type,
        organizer,
        speakers,
        date,
        duration,
        maxAttendees,
        attendees: [],
        registrationFee,
        location,
        status: 'UPCOMING',
        createdAt: new Date(),
      };

      this.communityEvents.set(event.id, event);
      await this.storeCommunityEvent(event);
      
      console.log(`Created community event ${event.id}: ${title}`);
      return event;
    } catch (error) {
      console.error('Failed to create community event:', error);
      throw error;
    }
  }

  public async registerForEvent(
    eventId: string,
    attendee: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const event = this.communityEvents.get(eventId);
      if (!event) {
        throw new Error(`Event ${eventId} not found`);
      }

      if (event.attendees.length >= event.maxAttendees) {
        return { success: false, message: 'Event is full' };
      }

      if (event.attendees.includes(attendee)) {
        return { success: false, message: 'Already registered for this event' };
      }

      event.attendees.push(attendee);
      await this.updateCommunityEvent(event);
      
      console.log(`Registered ${attendee} for event ${eventId}`);
      return { success: true, message: 'Successfully registered for event' };
    } catch (error) {
      console.error('Failed to register for event:', error);
      return { success: false, message: 'Registration failed' };
    }
  }

  // Community Rewards
  public async awardContributionReward(
    recipient: string,
    type: CommunityReward['type'],
    amount: number = 10,
    reason?: string
  ): Promise<CommunityReward> {
    try {
      const reward: CommunityReward = {
        id: `reward_${Date.now()}_${recipient.slice(-8)}`,
        recipient,
        type,
        amount,
        reason: reason || `Reward for ${type.toLowerCase().replace('_', ' ')}`,
        status: 'PENDING',
        createdAt: new Date(),
      };

      this.communityRewards.set(reward.id, reward);
      await this.storeCommunityReward(reward);
      
      console.log(`Awarded ${amount} HBAR to ${recipient} for ${type}`);
      return reward;
    } catch (error) {
      console.error('Failed to award contribution reward:', error);
      throw error;
    }
  }

  // Analytics
  public async getCommunityAnalytics(): Promise<{
    totalExperts: number;
    activeConsultations: number;
    totalForumPosts: number;
    totalKnowledgeArticles: number;
    upcomingEvents: number;
    totalRewardsDistributed: number;
    topContributors: { address: string; contributions: number }[];
  }> {
    try {
      const totalExperts = this.experts.size;
      const activeConsultations = Array.from(this.consultations.values())
        .filter(c => c.status === 'SCHEDULED' || c.status === 'IN_PROGRESS').length;
      const totalForumPosts = this.forumPosts.size;
      const totalKnowledgeArticles = this.knowledgeArticles.size;
      const upcomingEvents = Array.from(this.communityEvents.values())
        .filter(e => e.status === 'UPCOMING').length;
      const totalRewardsDistributed = Array.from(this.communityRewards.values())
        .filter(r => r.status === 'PAID').reduce((sum, r) => sum + r.amount, 0);

      // Calculate top contributors
      const contributionCounts = new Map<string, number>();
      for (const reward of this.communityRewards.values()) {
        const count = contributionCounts.get(reward.recipient) || 0;
        contributionCounts.set(reward.recipient, count + 1);
      }

      const topContributors = Array.from(contributionCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([address, contributions]) => ({ address, contributions }));

      return {
        totalExperts,
        activeConsultations,
        totalForumPosts,
        totalKnowledgeArticles,
        upcomingEvents,
        totalRewardsDistributed,
        topContributors,
      };
    } catch (error) {
      console.error('Failed to get community analytics:', error);
      throw error;
    }
  }

  // Private helper methods
  private async initializeCommunity(): Promise<void> {
    console.log('Initializing community features...');
  }

  private async checkExpertAvailability(
    expertId: string,
    scheduledAt: Date,
    duration: number
  ): Promise<boolean> {
    const expert = this.experts.get(expertId);
    if (!expert) return false;

    const scheduledDate = scheduledAt.toISOString().split('T')[0];
    const scheduledTime = scheduledAt.toTimeString().slice(0, 5);
    const endTime = new Date(scheduledAt.getTime() + duration * 60000).toTimeString().slice(0, 5);

    return expert.availability.some(slot => 
      slot.date === scheduledDate &&
      !slot.isBooked &&
      slot.startTime <= scheduledTime &&
      slot.endTime >= endTime
    );
  }

  private async markTimeSlotAsBooked(
    expertId: string,
    scheduledAt: Date,
    duration: number,
    bookingId: string
  ): Promise<void> {
    const expert = this.experts.get(expertId);
    if (!expert) return;

    const scheduledDate = scheduledAt.toISOString().split('T')[0];
    const scheduledTime = scheduledAt.toTimeString().slice(0, 5);

    const slot = expert.availability.find(s => 
      s.date === scheduledDate && s.startTime === scheduledTime
    );

    if (slot) {
      slot.isBooked = true;
      slot.bookingId = bookingId;
      await this.updateExpert(expert);
    }
  }

  private async awardConsultationRewards(consultation: Consultation): Promise<void> {
    // Award rewards for completing consultation
    await this.awardContributionReward(
      consultation.expertId,
      'CONSULTATION',
      20,
      `Completed consultation: ${consultation.subject}`
    );

    await this.awardContributionReward(
      consultation.clientId,
      'CONSULTATION',
      10,
      `Attended consultation: ${consultation.subject}`
    );
  }

  // Database operations (simplified)
  private async storeExpert(expert: Expert): Promise<void> { console.log(`Storing expert: ${expert.id}`); }
  private async updateExpert(expert: Expert): Promise<void> { console.log(`Updating expert: ${expert.id}`); }
  private async storeConsultation(consultation: Consultation): Promise<void> { console.log(`Storing consultation: ${consultation.id}`); }
  private async updateConsultation(consultation: Consultation): Promise<void> { console.log(`Updating consultation: ${consultation.id}`); }
  private async storeForumPost(post: ForumPost): Promise<void> { console.log(`Storing forum post: ${post.id}`); }
  private async updateForumPost(post: ForumPost): Promise<void> { console.log(`Updating forum post: ${post.id}`); }
  private async storeKnowledgeArticle(article: KnowledgeArticle): Promise<void> { console.log(`Storing knowledge article: ${article.id}`); }
  private async storeCommunityEvent(event: CommunityEvent): Promise<void> { console.log(`Storing community event: ${event.id}`); }
  private async updateCommunityEvent(event: CommunityEvent): Promise<void> { console.log(`Updating community event: ${event.id}`); }
  private async storeCommunityReward(reward: CommunityReward): Promise<void> { console.log(`Storing community reward: ${reward.id}`); }
}

// Export singleton instance
export const communityService = CommunityService.getInstance();
