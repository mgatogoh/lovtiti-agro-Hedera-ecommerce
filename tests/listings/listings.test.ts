import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock Prisma Client
const mockPrisma = {
  listing: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  profile: {
    findFirst: jest.fn(),
  },
};

// Mock Next.js auth
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

describe('Listings API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/listings', () => {
    it('should return listings with pagination', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Fresh Tomatoes',
          description: 'Organic tomatoes',
          priceCents: 50000,
          quantity: 100,
          unit: 'kg',
          category: 'Vegetables',
          images: ['image1.jpg'],
          seller: {
            id: 'seller1',
            email: 'farmer@example.com',
            profiles: [{ fullName: 'John Farmer', country: 'Nigeria' }],
          },
        },
      ];

      mockPrisma.listing.findMany.mockResolvedValue(mockListings);
      mockPrisma.listing.count.mockResolvedValue(1);

      // Mock the API route
      const { GET } = await import('../../app/api/listings/route');
      const request = new Request('http://localhost:3000/api/listings');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.listings).toHaveLength(1);
      expect(data.pagination.total).toBe(1);
      expect(mockPrisma.listing.findMany).toHaveBeenCalled();
    });

    it('should filter listings by category', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Fresh Tomatoes',
          category: 'Vegetables',
          priceCents: 50000,
          quantity: 100,
          unit: 'kg',
          images: ['image1.jpg'],
          seller: { id: 'seller1', email: 'farmer@example.com' },
        },
      ];

      mockPrisma.listing.findMany.mockResolvedValue(mockListings);
      mockPrisma.listing.count.mockResolvedValue(1);

      const { GET } = await import('../../app/api/listings/route');
      const request = new Request('http://localhost:3000/api/listings?category=Vegetables');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.listing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'Vegetables',
          }),
        })
      );
    });

    it('should search listings by query', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Fresh Tomatoes',
          description: 'Organic tomatoes',
          priceCents: 50000,
          quantity: 100,
          unit: 'kg',
          category: 'Vegetables',
          images: ['image1.jpg'],
          seller: { id: 'seller1', email: 'farmer@example.com' },
        },
      ];

      mockPrisma.listing.findMany.mockResolvedValue(mockListings);
      mockPrisma.listing.count.mockResolvedValue(1);

      const { GET } = await import('../../app/api/listings/route');
      const request = new Request('http://localhost:3000/api/listings?search=tomatoes');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.listing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { title: { contains: 'tomatoes', mode: 'insensitive' } },
              { description: { contains: 'tomatoes', mode: 'insensitive' } },
              { category: { contains: 'tomatoes', mode: 'insensitive' } },
            ]),
          }),
        })
      );
    });
  });

  describe('POST /api/listings', () => {
    it('should create a new listing', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth;
      mockAuth.mockResolvedValue({ userId: 'user123' });

      const mockProfile = {
        id: 'profile1',
        userId: 'user123',
        type: 'FARMER',
        kycStatus: 'APPROVED',
      };

      const mockListing = {
        id: '1',
        title: 'Fresh Tomatoes',
        description: 'Organic tomatoes',
        priceCents: 50000,
        quantity: 100,
        unit: 'kg',
        category: 'Vegetables',
        images: ['image1.jpg'],
        sellerId: 'user123',
      };

      mockPrisma.profile.findFirst.mockResolvedValue(mockProfile);
      mockPrisma.listing.create.mockResolvedValue(mockListing);

      const { POST } = await import('../../app/api/listings/route');
      const request = new Request('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Fresh Tomatoes',
          description: 'Organic tomatoes',
          priceCents: 50000,
          quantity: 100,
          unit: 'kg',
          category: 'Vegetables',
          images: ['image1.jpg'],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe('Fresh Tomatoes');
      expect(mockPrisma.listing.create).toHaveBeenCalled();
    });

    it('should reject listing creation for non-farmers', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth;
      mockAuth.mockResolvedValue({ userId: 'user123' });

      mockPrisma.profile.findFirst.mockResolvedValue(null);

      const { POST } = await import('../../app/api/listings/route');
      const request = new Request('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Fresh Tomatoes',
          description: 'Organic tomatoes',
          priceCents: 50000,
          quantity: 100,
          unit: 'kg',
          category: 'Vegetables',
          images: ['image1.jpg'],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth;
      mockAuth.mockResolvedValue({ userId: 'user123' });

      const { POST } = await import('../../app/api/listings/route');
      const request = new Request('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '',
          description: 'Organic tomatoes',
          priceCents: 50000,
          quantity: 100,
          unit: 'kg',
          category: 'Vegetables',
          images: ['image1.jpg'],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/listings/[id]', () => {
    it('should update a listing', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth;
      mockAuth.mockResolvedValue({ userId: 'user123' });

      const mockExistingListing = {
        id: '1',
        sellerId: 'user123',
      };

      const mockUpdatedListing = {
        id: '1',
        title: 'Updated Tomatoes',
        description: 'Updated description',
        priceCents: 60000,
        quantity: 150,
        unit: 'kg',
        category: 'Vegetables',
        images: ['image1.jpg'],
        sellerId: 'user123',
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockExistingListing);
      mockPrisma.listing.update.mockResolvedValue(mockUpdatedListing);

      const { PUT } = await import('../../app/api/listings/[id]/route');
      const request = new Request('http://localhost:3000/api/listings/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Updated Tomatoes',
          description: 'Updated description',
          priceCents: 60000,
          quantity: 150,
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Updated Tomatoes');
      expect(mockPrisma.listing.update).toHaveBeenCalled();
    });

    it('should reject update for non-owners', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth;
      mockAuth.mockResolvedValue({ userId: 'user123' });

      const mockExistingListing = {
        id: '1',
        sellerId: 'different-user',
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockExistingListing);

      const { PUT } = await import('../../app/api/listings/[id]/route');
      const request = new Request('http://localhost:3000/api/listings/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Updated Tomatoes',
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/listings/[id]', () => {
    it('should soft delete a listing', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth;
      mockAuth.mockResolvedValue({ userId: 'user123' });

      const mockExistingListing = {
        id: '1',
        sellerId: 'user123',
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockExistingListing);
      mockPrisma.listing.update.mockResolvedValue({});

      const { DELETE } = await import('../../app/api/listings/[id]/route');
      const request = new Request('http://localhost:3000/api/listings/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });

      expect(response.status).toBe(200);
      expect(mockPrisma.listing.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false },
      });
    });

    it('should reject deletion for non-owners', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth;
      mockAuth.mockResolvedValue({ userId: 'user123' });

      const mockExistingListing = {
        id: '1',
        sellerId: 'different-user',
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockExistingListing);

      const { DELETE } = await import('../../app/api/listings/[id]/route');
      const request = new Request('http://localhost:3000/api/listings/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });

      expect(response.status).toBe(403);
    });
  });
});
