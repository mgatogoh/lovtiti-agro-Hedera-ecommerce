// Community Service Tests for Phase 3
import { communityService, Expert, Consultation, ForumPost, KnowledgeArticle, CommunityEvent, CommunityReward } from '../../utils/communityService';

describe('Community Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Expert Management', () => {
    it('should register expert', async () => {
      const address = '0.0.expert123';
      const name = 'Dr. John Smith';
      const title = 'Agricultural Consultant';
      const specialties = ['Crop Management', 'Soil Analysis', 'Pest Control'];
      const experience = 15;
      const hourlyRate = 100;
      const bio = 'Expert in sustainable agriculture with 15 years of experience';
      const certifications = ['PhD Agriculture', 'Certified Agronomist'];

      const expert = await communityService.registerExpert(
        address,
        name,
        title,
        specialties,
        experience,
        hourlyRate,
        bio,
        certifications
      );

      expect(expert).toHaveProperty('id');
      expect(expert).toHaveProperty('address', address);
      expect(expert).toHaveProperty('name', name);
      expect(expert).toHaveProperty('title', title);
      expect(expert).toHaveProperty('specialties', specialties);
      expect(expert).toHaveProperty('experience', experience);
      expect(expert).toHaveProperty('rating', 0);
      expect(expert).toHaveProperty('totalConsultations', 0);
      expect(expert).toHaveProperty('hourlyRate', hourlyRate);
      expect(expert).toHaveProperty('availability', []);
      expect(expert).toHaveProperty('certifications', certifications);
      expect(expert).toHaveProperty('bio', bio);
      expect(expert).toHaveProperty('verified', false);
      expect(expert).toHaveProperty('reputation', 50);
      expect(expert).toHaveProperty('joinedAt');
      expect(expert).toHaveProperty('lastActive');

      console.log(`Registered expert: ${expert.name} (${expert.id})`);
    });

    it('should update expert availability', async () => {
      const expert = await communityService.registerExpert(
        '0.0.availability123',
        'Dr. Availability Test',
        'Test Consultant',
        ['Testing'],
        5,
        50,
        'Test expert for availability',
        ['Test Certification']
      );

      const availability = [
        {
          id: 'slot_1',
          date: '2024-01-20',
          startTime: '09:00',
          endTime: '17:00',
          isBooked: false,
        },
        {
          id: 'slot_2',
          date: '2024-01-21',
          startTime: '10:00',
          endTime: '16:00',
          isBooked: false,
        },
      ];

      await communityService.updateExpertAvailability(expert.id, availability);

      console.log(`Updated availability for expert ${expert.id}`);
    });

    it('should get available experts', async () => {
      // Register multiple experts
      await communityService.registerExpert(
        '0.0.expert1',
        'Dr. Expert One',
        'Crop Specialist',
        ['Crop Management'],
        10,
        80,
        'Expert in crop management',
        ['Crop Certification']
      );

      await communityService.registerExpert(
        '0.0.expert2',
        'Dr. Expert Two',
        'Soil Specialist',
        ['Soil Analysis'],
        8,
        120,
        'Expert in soil analysis',
        ['Soil Certification']
      );

      // Get experts without filters
      let experts = await communityService.getAvailableExperts();
      expect(Array.isArray(experts)).toBe(true);
      expect(experts.length).toBeGreaterThan(0);

      // Get experts with specialty filter
      experts = await communityService.getAvailableExperts('Crop Management');
      expect(experts.length).toBeGreaterThan(0);

      // Get experts with rate filter
      experts = await communityService.getAvailableExperts(undefined, 100);
      expect(experts.length).toBeGreaterThan(0);

      // Get experts with rating filter
      experts = await communityService.getAvailableExperts(undefined, undefined, 4.0);
      expect(Array.isArray(experts)).toBe(true);

      console.log(`Found ${experts.length} available experts`);
    });
  });

  describe('Consultation Management', () => {
    let testExpert: Expert;

    beforeEach(async () => {
      testExpert = await communityService.registerExpert(
        '0.0.consultation123',
        'Dr. Consultation Test',
        'Consultation Specialist',
        ['General Consultation'],
        10,
        100,
        'Expert in consultations',
        ['Consultation Certification']
      );

      // Set availability
      await communityService.updateExpertAvailability(testExpert.id, [
        {
          id: 'slot_1',
          date: '2024-01-20',
          startTime: '09:00',
          endTime: '17:00',
          isBooked: false,
        },
      ]);
    });

    it('should book consultation', async () => {
      const clientId = '0.0.client123';
      const nftTokenId = '0.0.nft123';
      const type = 'SPECIFIC_NFT' as const;
      const subject = 'Crop Disease Analysis';
      const description = 'Need help analyzing crop disease in my NFT-represented harvest';
      const scheduledAt = new Date('2024-01-20T10:00:00Z');
      const duration = 60; // 60 minutes

      const consultation = await communityService.bookConsultation(
        testExpert.id,
        clientId,
        type,
        subject,
        description,
        scheduledAt,
        duration,
        nftTokenId
      );

      expect(consultation).toHaveProperty('id');
      expect(consultation).toHaveProperty('expertId', testExpert.id);
      expect(consultation).toHaveProperty('clientId', clientId);
      expect(consultation).toHaveProperty('nftTokenId', nftTokenId);
      expect(consultation).toHaveProperty('type', type);
      expect(consultation).toHaveProperty('subject', subject);
      expect(consultation).toHaveProperty('description', description);
      expect(consultation).toHaveProperty('scheduledAt', scheduledAt);
      expect(consultation).toHaveProperty('duration', duration);
      expect(consultation).toHaveProperty('status', 'SCHEDULED');
      expect(consultation).toHaveProperty('rate', testExpert.hourlyRate);
      expect(consultation).toHaveProperty('totalCost');
      expect(consultation).toHaveProperty('paymentStatus', 'PENDING');
      expect(consultation).toHaveProperty('createdAt');
      expect(consultation).toHaveProperty('updatedAt');

      // Verify total cost calculation
      const expectedCost = (testExpert.hourlyRate * duration) / 60;
      expect(consultation.totalCost).toBe(expectedCost);

      console.log(`Booked consultation ${consultation.id} for ${consultation.totalCost} HBAR`);
    });

    it('should complete consultation', async () => {
      // First book a consultation
      const consultation = await communityService.bookConsultation(
        testExpert.id,
        '0.0.client456',
        'GENERAL',
        'General Consultation',
        'General agricultural advice',
        new Date('2024-01-20T10:00:00Z'),
        60
      );

      const notes = 'Provided comprehensive advice on crop rotation and soil management';
      const rating = 5;
      const feedback = 'Excellent consultation, very helpful advice!';

      await communityService.completeConsultation(
        consultation.id,
        notes,
        rating,
        feedback
      );

      console.log(`Completed consultation ${consultation.id} with rating ${rating}`);
    });

    it('should handle unavailable expert', async () => {
      const clientId = '0.0.client789';
      const scheduledAt = new Date('2024-01-25T10:00:00Z'); // No availability set for this date

      await expect(communityService.bookConsultation(
        testExpert.id,
        clientId,
        'GENERAL',
        'Test Consultation',
        'Test description',
        scheduledAt,
        60
      )).rejects.toThrow('Expert not available at requested time');
    });
  });

  describe('Forum Management', () => {
    it('should create forum post', async () => {
      const author = '0.0.forum123';
      const title = 'Best Practices for Organic Farming';
      const content = 'I would like to share some best practices for organic farming...';
      const category = 'GENERAL' as const;
      const tags = ['organic', 'farming', 'best-practices'];

      const post = await communityService.createForumPost(
        author,
        title,
        content,
        category,
        tags
      );

      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('author', author);
      expect(post).toHaveProperty('title', title);
      expect(post).toHaveProperty('content', content);
      expect(post).toHaveProperty('category', category);
      expect(post).toHaveProperty('tags', tags);
      expect(post).toHaveProperty('upvotes', 0);
      expect(post).toHaveProperty('downvotes', 0);
      expect(post).toHaveProperty('replies', []);
      expect(post).toHaveProperty('views', 0);
      expect(post).toHaveProperty('isPinned', false);
      expect(post).toHaveProperty('isLocked', false);
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('updatedAt');

      console.log(`Created forum post ${post.id}: ${title}`);
    });

    it('should reply to forum post', async () => {
      // First create a post
      const post = await communityService.createForumPost(
        '0.0.original123',
        'Original Post',
        'Original content',
        'GENERAL',
        ['original']
      );

      const replyAuthor = '0.0.reply123';
      const replyContent = 'Great post! I have some additional insights to share...';

      const reply = await communityService.replyToForumPost(
        post.id,
        replyAuthor,
        replyContent
      );

      expect(reply).toHaveProperty('id');
      expect(reply).toHaveProperty('postId', post.id);
      expect(reply).toHaveProperty('author', replyAuthor);
      expect(reply).toHaveProperty('content', replyContent);
      expect(reply).toHaveProperty('upvotes', 0);
      expect(reply).toHaveProperty('downvotes', 0);
      expect(reply).toHaveProperty('isAccepted', false);
      expect(reply).toHaveProperty('createdAt');
      expect(reply).toHaveProperty('updatedAt');

      console.log(`Added reply to forum post ${post.id}`);
    });

    it('should vote on forum content', async () => {
      // Create a post first
      const post = await communityService.createForumPost(
        '0.0.vote123',
        'Vote Test Post',
        'Content for voting test',
        'GENERAL',
        ['vote-test']
      );

      const voter = '0.0.voter123';

      // Upvote the post
      await communityService.voteOnForumContent(post.id, voter, 'UPVOTE', 'POST');

      console.log(`Voted on forum post ${post.id}`);
    });
  });

  describe('Knowledge Base Management', () => {
    it('should create knowledge article', async () => {
      const author = '0.0.knowledge123';
      const title = 'Understanding NFT-Based Supply Chain Tracking';
      const content = 'This article explains how NFT technology enables transparent supply chain tracking...';
      const category = 'TECHNICAL';
      const tags = ['nft', 'supply-chain', 'blockchain'];
      const difficulty = 'INTERMEDIATE' as const;
      const estimatedReadTime = 15;

      const article = await communityService.createKnowledgeArticle(
        author,
        title,
        content,
        category,
        tags,
        difficulty,
        estimatedReadTime
      );

      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title', title);
      expect(article).toHaveProperty('content', content);
      expect(article).toHaveProperty('author', author);
      expect(article).toHaveProperty('category', category);
      expect(article).toHaveProperty('tags', tags);
      expect(article).toHaveProperty('difficulty', difficulty);
      expect(article).toHaveProperty('estimatedReadTime', estimatedReadTime);
      expect(article).toHaveProperty('views', 0);
      expect(article).toHaveProperty('likes', 0);
      expect(article).toHaveProperty('bookmarks', 0);
      expect(article).toHaveProperty('isFeatured', false);
      expect(article).toHaveProperty('isVerified', false);
      expect(article).toHaveProperty('createdAt');
      expect(article).toHaveProperty('updatedAt');

      console.log(`Created knowledge article ${article.id}: ${title}`);
    });

    it('should get knowledge articles with filters', async () => {
      // Create test articles
      await communityService.createKnowledgeArticle(
        '0.0.author1',
        'Beginner Guide to DeFi',
        'A beginner guide to decentralized finance',
        'DEFI',
        ['defi', 'beginner'],
        'BEGINNER',
        10
      );

      await communityService.createKnowledgeArticle(
        '0.0.author2',
        'Advanced Smart Contract Development',
        'Advanced smart contract development techniques',
        'TECHNICAL',
        ['smart-contracts', 'advanced'],
        'ADVANCED',
        30
      );

      // Get all articles
      let articles = await communityService.getKnowledgeArticles();
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);

      // Filter by category
      articles = await communityService.getKnowledgeArticles('DEFI');
      expect(articles.length).toBeGreaterThan(0);

      // Filter by difficulty
      articles = await communityService.getKnowledgeArticles(undefined, 'BEGINNER');
      expect(articles.length).toBeGreaterThan(0);

      // Filter by tags
      articles = await communityService.getKnowledgeArticles(undefined, undefined, ['defi']);
      expect(articles.length).toBeGreaterThan(0);

      console.log(`Retrieved ${articles.length} knowledge articles`);
    });
  });

  describe('Community Events', () => {
    it('should create community event', async () => {
      const organizer = '0.0.organizer123';
      const title = 'Webinar: Sustainable Agriculture in 2024';
      const description = 'Join us for an informative webinar on sustainable agriculture practices';
      const type = 'WEBINAR' as const;
      const date = new Date('2024-02-15T14:00:00Z');
      const duration = 90; // 90 minutes
      const maxAttendees = 100;
      const registrationFee = 25; // 25 HBAR
      const location = 'Virtual (Zoom)';
      const speakers = ['0.0.speaker1', '0.0.speaker2'];

      const event = await communityService.createCommunityEvent(
        organizer,
        title,
        description,
        type,
        date,
        duration,
        maxAttendees,
        registrationFee,
        location,
        speakers
      );

      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title', title);
      expect(event).toHaveProperty('description', description);
      expect(event).toHaveProperty('type', type);
      expect(event).toHaveProperty('organizer', organizer);
      expect(event).toHaveProperty('speakers', speakers);
      expect(event).toHaveProperty('date', date);
      expect(event).toHaveProperty('duration', duration);
      expect(event).toHaveProperty('maxAttendees', maxAttendees);
      expect(event).toHaveProperty('attendees', []);
      expect(event).toHaveProperty('registrationFee', registrationFee);
      expect(event).toHaveProperty('location', location);
      expect(event).toHaveProperty('status', 'UPCOMING');
      expect(event).toHaveProperty('createdAt');

      console.log(`Created community event ${event.id}: ${title}`);
    });

    it('should register for event', async () => {
      // Create event first
      const event = await communityService.createCommunityEvent(
        '0.0.event123',
        'Test Event',
        'Test event description',
        'WORKSHOP',
        new Date('2024-02-20T10:00:00Z'),
        120,
        50,
        10,
        'Virtual',
        ['0.0.speaker1']
      );

      const attendee = '0.0.attendee123';

      const result = await communityService.registerForEvent(event.id, attendee);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message', 'Successfully registered for event');

      console.log(`Registered ${attendee} for event ${event.id}`);
    });

    it('should handle full event registration', async () => {
      // Create event with low capacity
      const event = await communityService.createCommunityEvent(
        '0.0.full123',
        'Full Event',
        'Event that will be full',
        'CONFERENCE',
        new Date('2024-02-25T09:00:00Z'),
        480,
        1, // Only 1 attendee allowed
        100,
        'Conference Center',
        ['0.0.speaker1']
      );

      // Register first attendee
      await communityService.registerForEvent(event.id, '0.0.attendee1');

      // Try to register second attendee
      const result = await communityService.registerForEvent(event.id, '0.0.attendee2');

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Event is full');

      console.log('Event registration properly handled full capacity');
    });
  });

  describe('Community Rewards', () => {
    it('should award contribution reward', async () => {
      const recipient = '0.0.contributor123';
      const type = 'CONTRIBUTION' as const;
      const amount = 50; // 50 HBAR
      const reason = 'Outstanding contribution to community knowledge base';

      const reward = await communityService.awardContributionReward(
        recipient,
        type,
        amount,
        reason
      );

      expect(reward).toHaveProperty('id');
      expect(reward).toHaveProperty('recipient', recipient);
      expect(reward).toHaveProperty('type', type);
      expect(reward).toHaveProperty('amount', amount);
      expect(reward).toHaveProperty('reason', reason);
      expect(reward).toHaveProperty('status', 'PENDING');
      expect(reward).toHaveProperty('createdAt');

      console.log(`Awarded ${amount} HBAR to ${recipient} for ${type}`);
    });
  });

  describe('Analytics', () => {
    it('should get community analytics', async () => {
      // Create some test data
      await communityService.registerExpert(
        '0.0.analytics123',
        'Dr. Analytics',
        'Analytics Expert',
        ['Analytics'],
        5,
        75,
        'Expert in analytics',
        ['Analytics Certification']
      );

      await communityService.createForumPost(
        '0.0.analytics123',
        'Analytics Test Post',
        'Test post for analytics',
        'GENERAL',
        ['analytics']
      );

      const analytics = await communityService.getCommunityAnalytics();

      expect(analytics).toHaveProperty('totalExperts');
      expect(analytics).toHaveProperty('activeConsultations');
      expect(analytics).toHaveProperty('totalForumPosts');
      expect(analytics).toHaveProperty('totalKnowledgeArticles');
      expect(analytics).toHaveProperty('upcomingEvents');
      expect(analytics).toHaveProperty('totalRewardsDistributed');
      expect(analytics).toHaveProperty('topContributors');

      expect(typeof analytics.totalExperts).toBe('number');
      expect(typeof analytics.activeConsultations).toBe('number');
      expect(typeof analytics.totalForumPosts).toBe('number');
      expect(typeof analytics.totalKnowledgeArticles).toBe('number');
      expect(typeof analytics.upcomingEvents).toBe('number');
      expect(typeof analytics.totalRewardsDistributed).toBe('number');
      expect(Array.isArray(analytics.topContributors)).toBe(true);

      console.log('Community Analytics:', analytics);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid expert operations', async () => {
      const invalidExpertId = 'invalid_expert_id';

      await expect(communityService.updateExpertAvailability(invalidExpertId, []))
        .rejects.toThrow(`Expert ${invalidExpertId} not found`);
    });

    it('should handle invalid consultation operations', async () => {
      const invalidConsultationId = 'invalid_consultation_id';

      await expect(communityService.completeConsultation(
        invalidConsultationId,
        'Test notes',
        5,
        'Test feedback'
      )).rejects.toThrow(`Consultation ${invalidConsultationId} not found`);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full community workflow', async () => {
      const expertAddress = '0.0.workflow123';
      const clientAddress = '0.0.client456';
      const contributorAddress = '0.0.contributor789';

      // 1. Register expert
      const expert = await communityService.registerExpert(
        expertAddress,
        'Dr. Workflow Test',
        'Integration Test Expert',
        ['Integration Testing'],
        10,
        100,
        'Expert for integration testing',
        ['Integration Certification']
      );
      console.log(`✅ Registered expert: ${expert.name}`);

      // 2. Set availability
      await communityService.updateExpertAvailability(expert.id, [
        {
          id: 'workflow_slot',
          date: '2024-02-01',
          startTime: '09:00',
          endTime: '17:00',
          isBooked: false,
        },
      ]);
      console.log(`✅ Set expert availability`);

      // 3. Book consultation
      const consultation = await communityService.bookConsultation(
        expert.id,
        clientAddress,
        'GENERAL',
        'Integration Test Consultation',
        'Test consultation for integration workflow',
        new Date('2024-02-01T10:00:00Z'),
        60
      );
      console.log(`✅ Booked consultation: ${consultation.id}`);

      // 4. Complete consultation
      await communityService.completeConsultation(
        consultation.id,
        'Integration test completed successfully',
        5,
        'Excellent integration test!'
      );
      console.log(`✅ Completed consultation`);

      // 5. Create forum post
      const forumPost = await communityService.createForumPost(
        contributorAddress,
        'Integration Test Results',
        'Results of our integration testing',
        'TECHNICAL',
        ['integration', 'testing']
      );
      console.log(`✅ Created forum post: ${forumPost.id}`);

      // 6. Create knowledge article
      const article = await communityService.createKnowledgeArticle(
        contributorAddress,
        'Integration Testing Guide',
        'Comprehensive guide to integration testing',
        'TECHNICAL',
        ['integration', 'testing', 'guide'],
        'ADVANCED',
        20
      );
      console.log(`✅ Created knowledge article: ${article.id}`);

      // 7. Create community event
      const event = await communityService.createCommunityEvent(
        expertAddress,
        'Integration Testing Workshop',
        'Workshop on integration testing best practices',
        'WORKSHOP',
        new Date('2024-02-15T14:00:00Z'),
        120,
        50,
        25,
        'Virtual',
        [expertAddress]
      );
      console.log(`✅ Created community event: ${event.id}`);

      // 8. Award contribution reward
      const reward = await communityService.awardContributionReward(
        contributorAddress,
        'CONTRIBUTION',
        100,
        'Excellent integration testing contributions'
      );
      console.log(`✅ Awarded contribution reward: ${reward.amount} HBAR`);

      // 9. Get analytics
      const analytics = await communityService.getCommunityAnalytics();
      console.log(`✅ Analytics - Experts: ${analytics.totalExperts}, Posts: ${analytics.totalForumPosts}`);

      // Verify all components worked
      expect(expert.id).toBeTruthy();
      expect(consultation.id).toBeTruthy();
      expect(forumPost.id).toBeTruthy();
      expect(article.id).toBeTruthy();
      expect(event.id).toBeTruthy();
      expect(reward.id).toBeTruthy();
      expect(analytics.totalExperts).toBeGreaterThan(0);

      console.log('✅ Complete community workflow test passed');
    });
  });
});
