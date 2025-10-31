// NFT Component Tests for Phase 2 Features
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NFTDetail } from '../../components/nft/NFTDetail';
import { NFTTrading } from '../../components/nft/NFTTrading';
import { ServiceBooking } from '../../components/nft/ServiceBooking';
import { EquipmentLeasing } from '../../components/nft/EquipmentLeasing';
import { BaseNFT, NFTListing } from '../../types/nft';

// Mock the hooks
jest.mock('../../hooks/useNFT', () => ({
  useNFT: jest.fn(),
  useSupplyChain: jest.fn(),
}));

jest.mock('../../hooks/useWallet', () => ({
  useWallet: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useNFTMarketplace: jest.fn(),
  useServiceBooking: jest.fn(),
  useEquipmentLeasing: jest.fn(),
}));

describe('NFT Components', () => {
  const mockNFT: BaseNFT = {
    tokenId: '0.0.123456',
    contractAddress: '0.0.789012',
    owner: '0.0.owner123',
    creator: '0.0.creator456',
    tokenStandard: 'HTS-721',
    category: 'PRODUCT',
    metadata: {
      name: 'Organic Rice',
      description: 'Premium organic rice from sustainable farming',
      image: 'ipfs://QmHash123',
      attributes: {
        type: 'PRODUCT',
        productType: 'CROP',
        variety: 'Basmati',
        quantity: 100,
        unit: 'kg',
        harvestDate: '2024-01-15',
        expiryDate: '2024-12-15',
        qualityGrade: 'A',
        certifications: ['Organic', 'Fair Trade'],
        location: {
          latitude: 6.5244,
          longitude: 3.3792,
          address: 'Lagos, Nigeria',
          region: 'South West',
          country: 'Nigeria',
        },
        supplyChain: [],
        sustainability: {
          waterUsage: 'LOW',
          carbonFootprint: 'MINIMAL',
          pesticideFree: true,
          organicCertified: true,
          fairTrade: true,
          energySource: 'RENEWABLE',
          wasteReduction: 80,
        },
        pricing: {
          basePrice: 50,
          currency: 'HBAR',
          unit: 'per_kg',
        },
      },
    },
    royalties: {
      percentage: 2.5,
      recipient: '0.0.creator456',
      perpetual: true,
    },
    isBurned: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  const mockListing: NFTListing = {
    id: 'listing-123',
    tokenId: '0.0.123456',
    contractAddress: '0.0.789012',
    seller: '0.0.owner123',
    price: 5000,
    currency: 'HBAR',
    isActive: true,
    listingTime: new Date('2024-01-15'),
    category: 'PRODUCT',
    description: 'Premium organic rice',
    tags: ['organic', 'rice', 'sustainable'],
    views: 25,
    favorites: 5,
    isAuction: false,
    bidCount: 0,
    nft: mockNFT,
  };

  const mockServiceNFT: BaseNFT = {
    ...mockNFT,
    category: 'SERVICE',
    metadata: {
      ...mockNFT.metadata,
      name: 'Agricultural Consultation',
      description: 'Expert agricultural consultation services',
      attributes: {
        type: 'SERVICE',
        serviceType: 'CONSULTATION',
        provider: {
          name: 'Dr. John Smith',
          license: 'AGR-2024-001',
          rating: 4.8,
          experience: 10,
          specializations: ['Crop Management', 'Soil Analysis'],
          certifications: ['PhD Agriculture', 'Certified Agronomist'],
        },
        pricing: {
          basePrice: 100,
          currency: 'HBAR',
          unit: 'per_hour',
        },
        availability: {
          schedule: [],
          location: 'Lagos, Nigeria',
          advanceBookingDays: 7,
          minimumBookingHours: 2,
        },
        terms: {
          cancellationPolicy: '24 hours notice required',
          paymentTerms: 'Payment on completion',
          liabilityCoverage: 'Full insurance coverage',
          insuranceRequired: true,
          specialRequirements: ['Site visit required'],
        },
        coverage: [{
          region: 'South West Nigeria',
          cities: ['Lagos', 'Ibadan', 'Abeokuta'],
        }],
        specializations: ['Crop Management', 'Soil Analysis', 'Pest Control'],
      },
    },
  };

  const mockEquipmentNFT: BaseNFT = {
    ...mockNFT,
    category: 'EQUIPMENT',
    metadata: {
      ...mockNFT.metadata,
      name: 'John Deere Tractor',
      description: 'Heavy-duty farm tractor for various agricultural operations',
      attributes: {
        type: 'EQUIPMENT',
        equipmentType: 'TRACTOR',
        specifications: {
          model: 'John Deere 6120R',
          year: 2023,
          brand: 'John Deere',
          capacity: '120 HP',
          features: ['4WD', 'Air Conditioning', 'GPS Guidance', 'Auto Steer'],
          fuelType: 'Diesel',
          powerSource: 'Internal Combustion',
        },
        ownership: {
          owner: '0.0.owner123',
          title: 'John Deere 6120R',
          purchaseDate: '2023-01-15',
          purchasePrice: 150000,
          depreciationRate: 10,
        },
        leaseTerms: {
          dailyRate: 500,
          weeklyRate: 3000,
          monthlyRate: 10000,
          minimumPeriod: 1,
          deposit: 5000,
          insurance: true,
          maintenance: true,
          delivery: true,
          training: false,
        },
        maintenance: [],
        insurance: {
          provider: 'Agricultural Insurance Co.',
          policyNumber: 'AGR-INS-2024-001',
          coverage: ['Equipment Damage', 'Liability', 'Theft'],
          expiryDate: '2024-12-31',
          premium: 5000,
        },
        condition: 'EXCELLENT',
      },
    },
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock useWallet
    const { useWallet } = require('../../hooks/useWallet');
    useWallet.mockReturnValue({
      walletAccount: {
        hederaAccountId: '0.0.wallet123',
        ethereumAddress: '0x123456789',
        balance: { hbar: '1000', ethereum: '5.0' },
      },
      isConnected: true,
      connectWallet: jest.fn(),
    });

    // Mock useNFT
    const { useNFT } = require('../../hooks/useNFT');
    useNFT.mockReturnValue({
      nft: mockNFT,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    // Mock useSupplyChain
    const { useSupplyChain } = require('../../hooks/useNFT');
    useSupplyChain.mockReturnValue({
      supplyChain: [
        {
          step: 0,
          action: 'NFT_MINTED',
          location: 'Lovtiti Agro Mart',
          actor: '0.0.creator456',
          timestamp: '2024-01-15T10:00:00Z',
          verified: true,
          verifier: '0.0.creator456',
        },
        {
          step: 1,
          action: 'HARVESTED',
          location: 'Lagos Farm',
          actor: '0.0.farmer123',
          timestamp: '2024-01-10T08:00:00Z',
          verified: true,
          verifier: '0.0.inspector789',
        },
      ],
      isLoading: false,
      error: null,
      addSupplyChainStep: jest.fn(),
      verifySupplyChainStep: jest.fn(),
    });
  });

  describe('NFTDetail Component', () => {
    it('should render NFT details correctly', () => {
      render(<NFTDetail tokenId="0.0.123456" listing={mockListing} />);
      
      expect(screen.getByText('Organic Rice')).toBeInTheDocument();
      expect(screen.getByText('PRODUCT')).toBeInTheDocument();
      expect(screen.getByText('Token ID: 0.0.123456')).toBeInTheDocument();
      expect(screen.getByText('Premium organic rice from sustainable farming')).toBeInTheDocument();
    });

    it('should display product-specific attributes', () => {
      render(<NFTDetail tokenId="0.0.123456" listing={mockListing} />);
      
      expect(screen.getByText('Product Information')).toBeInTheDocument();
      expect(screen.getByText('Basmati')).toBeInTheDocument();
      expect(screen.getByText('Grade A')).toBeInTheDocument();
      expect(screen.getByText('100 kg')).toBeInTheDocument();
    });

    it('should display sustainability metrics', () => {
      render(<NFTDetail tokenId="0.0.123456" listing={mockListing} />);
      
      expect(screen.getByText('Sustainability Metrics')).toBeInTheDocument();
      expect(screen.getByText('Water Usage')).toBeInTheDocument();
      expect(screen.getByText('Carbon Footprint')).toBeInTheDocument();
      expect(screen.getByText('Pesticide Free')).toBeInTheDocument();
      expect(screen.getByText('Organic Certified')).toBeInTheDocument();
    });

    it('should show supply chain tab', async () => {
      render(<NFTDetail tokenId="0.0.123456" listing={mockListing} />);
      
      const supplyChainTab = screen.getByText('Supply Chain');
      fireEvent.click(supplyChainTab);
      
      await waitFor(() => {
        expect(screen.getByText('Supply Chain History')).toBeInTheDocument();
        expect(screen.getByText('NFT_MINTED')).toBeInTheDocument();
        expect(screen.getByText('HARVESTED')).toBeInTheDocument();
      });
    });

    it('should display analytics tab', async () => {
      render(<NFTDetail tokenId="0.0.123456" listing={mockListing} />);
      
      const analyticsTab = screen.getByText('Analytics');
      fireEvent.click(analyticsTab);
      
      await waitFor(() => {
        expect(screen.getByText('Views')).toBeInTheDocument();
        expect(screen.getByText('Favorites')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
      });
    });
  });

  describe('NFTTrading Component', () => {
    beforeEach(() => {
      const { useNFTMarketplace } = require('../../hooks');
      useNFTMarketplace.mockReturnValue({
        buyNFT: jest.fn().mockResolvedValue({ success: true }),
        isLoading: false,
        error: null,
      });
    });

    it('should render trading interface', () => {
      render(<NFTTrading listing={mockListing} />);
      
      expect(screen.getByText('Buy NFT')).toBeInTheDocument();
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Premium organic rice')).toBeInTheDocument();
      expect(screen.getByText('5000 HBAR')).toBeInTheDocument();
    });

    it('should show payment method selection', () => {
      render(<NFTTrading listing={mockListing} />);
      
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
      expect(screen.getByText('Pay with HBAR (Recommended)')).toBeInTheDocument();
      expect(screen.getByText('Pay with USD (Credit Card)')).toBeInTheDocument();
    });

    it('should display delivery address form', () => {
      render(<NFTTrading listing={mockListing} />);
      
      expect(screen.getByText('Delivery Address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Street Address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    });

    it('should calculate total cost with insurance', () => {
      render(<NFTTrading listing={mockListing} />);
      
      const insuranceCheckbox = screen.getByText('Add insurance protection (5% of item value)');
      fireEvent.click(insuranceCheckbox);
      
      expect(screen.getByText('5250.00 HBAR')).toBeInTheDocument(); // 5000 + 5% insurance + 2.5% platform fee
    });

    it('should proceed to payment step', async () => {
      render(<NFTTrading listing={mockListing} />);
      
      const continueButton = screen.getByText('Continue to Payment');
      fireEvent.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByText('Payment Information')).toBeInTheDocument();
        expect(screen.getByText('Payment Summary')).toBeInTheDocument();
      });
    });
  });

  describe('ServiceBooking Component', () => {
    beforeEach(() => {
      const { useServiceBooking } = require('../../hooks');
      useServiceBooking.mockReturnValue({
        bookService: jest.fn().mockResolvedValue({ id: 'booking-123' }),
        isLoading: false,
        error: null,
      });
    });

    it('should render service booking interface', () => {
      render(<ServiceBooking serviceNFT={mockServiceNFT} />);
      
      expect(screen.getByText('Book Service')).toBeInTheDocument();
      expect(screen.getByText('Agricultural Consultation')).toBeInTheDocument();
      expect(screen.getByText('CONSULTATION')).toBeInTheDocument();
    });

    it('should show date and time selection', () => {
      render(<ServiceBooking serviceNFT={mockServiceNFT} />);
      
      expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      expect(screen.getByText('Select Date')).toBeInTheDocument();
    });

    it('should display service details', () => {
      render(<ServiceBooking serviceNFT={mockServiceNFT} />);
      
      expect(screen.getByText('Service Details')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('4.8/5 ⭐')).toBeInTheDocument();
      expect(screen.getByText('100 HBAR per per_hour')).toBeInTheDocument();
    });

    it('should show duration selection', async () => {
      render(<ServiceBooking serviceNFT={mockServiceNFT} />);
      
      const dateInput = screen.getByDisplayValue('');
      fireEvent.change(dateInput, { target: { value: '2024-02-15' } });
      
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByText('Duration (hours)')).toBeInTheDocument();
        expect(screen.getByText('1 hour')).toBeInTheDocument();
        expect(screen.getByText('2 hours')).toBeInTheDocument();
      });
    });

    it('should calculate cost correctly', async () => {
      render(<ServiceBooking serviceNFT={mockServiceNFT} />);
      
      const dateInput = screen.getByDisplayValue('');
      fireEvent.change(dateInput, { target: { value: '2024-02-15' } });
      
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByText('Cost Breakdown')).toBeInTheDocument();
        expect(screen.getByText('105.00 HBAR')).toBeInTheDocument(); // 100 + 5% service fee
      });
    });
  });

  describe('EquipmentLeasing Component', () => {
    beforeEach(() => {
      const { useEquipmentLeasing } = require('../../hooks');
      useEquipmentLeasing.mockReturnValue({
        leaseEquipment: jest.fn().mockResolvedValue({ id: 'lease-123' }),
        isLoading: false,
        error: null,
      });
    });

    it('should render equipment leasing interface', () => {
      render(<EquipmentLeasing equipmentNFT={mockEquipmentNFT} />);
      
      expect(screen.getByText('Lease Equipment')).toBeInTheDocument();
      expect(screen.getByText('John Deere Tractor')).toBeInTheDocument();
      expect(screen.getByText('TRACTOR')).toBeInTheDocument();
    });

    it('should display equipment information', () => {
      render(<EquipmentLeasing equipmentNFT={mockEquipmentNFT} />);
      
      expect(screen.getByText('Equipment Information')).toBeInTheDocument();
      expect(screen.getByText('John Deere 6120R')).toBeInTheDocument();
      expect(screen.getByText('John Deere')).toBeInTheDocument();
      expect(screen.getByText('2023')).toBeInTheDocument();
      expect(screen.getByText('EXCELLENT')).toBeInTheDocument();
    });

    it('should show lease terms', () => {
      render(<EquipmentLeasing equipmentNFT={mockEquipmentNFT} />);
      
      expect(screen.getByText('Lease Terms')).toBeInTheDocument();
      expect(screen.getByText('500 HBAR')).toBeInTheDocument(); // Daily rate
      expect(screen.getByText('3000 HBAR')).toBeInTheDocument(); // Weekly rate
      expect(screen.getByText('10000 HBAR')).toBeInTheDocument(); // Monthly rate
      expect(screen.getByText('5000 HBAR')).toBeInTheDocument(); // Deposit
    });

    it('should display features and services', () => {
      render(<EquipmentLeasing equipmentNFT={mockEquipmentNFT} />);
      
      expect(screen.getByText('Features & Capabilities')).toBeInTheDocument();
      expect(screen.getByText('4WD')).toBeInTheDocument();
      expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
      expect(screen.getByText('GPS Guidance')).toBeInTheDocument();
      
      expect(screen.getByText('Services Included')).toBeInTheDocument();
      expect(screen.getByText('Insurance')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Delivery')).toBeInTheDocument();
    });

    it('should show lease period selection', async () => {
      render(<EquipmentLeasing equipmentNFT={mockEquipmentNFT} />);
      
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByText('Lease Period')).toBeInTheDocument();
        expect(screen.getByText('Start Date')).toBeInTheDocument();
        expect(screen.getByText('End Date')).toBeInTheDocument();
        expect(screen.getByText('Daily')).toBeInTheDocument();
        expect(screen.getByText('Weekly')).toBeInTheDocument();
        expect(screen.getByText('Monthly')).toBeInTheDocument();
      });
    });

    it('should calculate lease cost correctly', async () => {
      render(<EquipmentLeasing equipmentNFT={mockEquipmentNFT} />);
      
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);
      
      const startDateInput = screen.getByDisplayValue('');
      const endDateInput = screen.getAllByDisplayValue('')[1];
      
      fireEvent.change(startDateInput, { target: { value: '2024-02-15' } });
      fireEvent.change(endDateInput, { target: { value: '2024-02-17' } });
      
      await waitFor(() => {
        expect(screen.getByText('Lease Summary')).toBeInTheDocument();
        expect(screen.getByText('3 days')).toBeInTheDocument();
        expect(screen.getByText('6500 HBAR')).toBeInTheDocument(); // (500 * 2 days) + 5000 deposit
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle NFT not found error', () => {
      const { useNFT } = require('../../hooks/useNFT');
      useNFT.mockReturnValue({
        nft: null,
        isLoading: false,
        error: 'NFT not found',
        refetch: jest.fn(),
      });

      render(<NFTDetail tokenId="0.0.999999" />);
      
      expect(screen.getByText('NFT Not Found')).toBeInTheDocument();
      expect(screen.getByText('NFT not found')).toBeInTheDocument();
    });

    it('should handle loading states', () => {
      const { useNFT } = require('../../hooks/useNFT');
      useNFT.mockReturnValue({
        nft: null,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      render(<NFTDetail tokenId="0.0.123456" />);
      
      expect(screen.getByText('Loading NFTs...')).toBeInTheDocument();
    });

    it('should handle wallet connection errors', () => {
      const { useWallet } = require('../../hooks/useWallet');
      useWallet.mockReturnValue({
        walletAccount: null,
        isConnected: false,
        connectWallet: jest.fn(),
      });

      render(<NFTTrading listing={mockListing} />);
      
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should handle service NFT validation', () => {
      render(<ServiceBooking serviceNFT={mockNFT} />); // Product NFT instead of Service
      
      expect(screen.getByText('Invalid NFT Type')).toBeInTheDocument();
      expect(screen.getByText('This NFT is not a service NFT and cannot be booked.')).toBeInTheDocument();
    });

    it('should handle equipment NFT validation', () => {
      render(<EquipmentLeasing equipmentNFT={mockNFT} />); // Product NFT instead of Equipment
      
      expect(screen.getByText('Invalid NFT Type')).toBeInTheDocument();
      expect(screen.getByText('This NFT is not an equipment NFT and cannot be leased.')).toBeInTheDocument();
    });

    it('should handle auction listings', () => {
      const auctionListing = { ...mockListing, isAuction: true };
      render(<NFTTrading listing={auctionListing} />);
      
      expect(screen.getByText('Buy NFT')).toBeInTheDocument(); // Still shows Buy NFT for trading component
    });
  });
});
