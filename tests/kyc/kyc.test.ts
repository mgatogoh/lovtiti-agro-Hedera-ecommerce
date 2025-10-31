import {
	kycSchema,
	farmerKycSchema,
	distributorKycSchema,
	transporterKycSchema,
	buyerKycSchema,
	AGROEXPERTKycSchema
} from '../../utils/validators';

describe('KYC Validation System', () => {
	describe('Base KYC Schema', () => {
		const baseKycData = {
			fullName: 'John Doe',
			country: 'Nigeria',
			address: '123 Main Street, Lagos',
			idNumber: '1234567890',
			phone: '+2341234567890',
			hederaWallet: '0.0.123456789012345678901234567890',
		};

		it('should validate farmer KYC data', () => {
			const farmerData = {
				...baseKycData,
				type: 'FARMER' as const,
				landOwnership: 'Land Title Document',
				certifications: ['Organic Farming Certificate'],
				farmSize: 50,
				cropTypes: ['Rice', 'Maize'],
			};

			const result = farmerKycSchema.safeParse(farmerData);
			expect(result.success).toBe(true);
		});

		it('should validate distributor KYC data', () => {
			const distributorData = {
				...baseKycData,
				type: 'DISTRIBUTOR' as const,
				businessLicense: 'BL123456789',
				warehouseCert: 'WH987654321',
				taxId: 'TAX123456',
				businessType: 'Agricultural Products Distribution',
				storageCapacity: 1000,
			};

			const result = distributorKycSchema.safeParse(distributorData);
			expect(result.success).toBe(true);
		});

		it('should validate transporter KYC data', () => {
			const transporterData = {
				...baseKycData,
				type: 'TRANSPORTER' as const,
				vehicleRegistrations: ['ABC123', 'XYZ789'],
				insurancePolicy: 'INS123456789',
				drivingLicense: 'DL987654321',
				fleetSize: 5,
				vehicleTypes: ['Truck', 'Van'],
			};

			const result = transporterKycSchema.safeParse(transporterData);
			expect(result.success).toBe(true);
		});

		it('should validate buyer KYC data', () => {
			const buyerData = {
				...baseKycData,
				type: 'BUYER' as const,
				businessRegistration: 'BR123456789',
				creditVerification: 'CV987654321',
				businessType: 'Food Processing Company',
				monthlyVolume: 5000,
			};

			const result = buyerKycSchema.safeParse(buyerData);
			expect(result.success).toBe(true);
		});

		it('should validate AGROEXPERT KYC data', () => {
			const AGROEXPERTData = {
				...baseKycData,
				type: 'AGROEXPERT' as const,
				professionalLicense: 'PL123456789',
				productSupplierPermits: ['PSP123', 'PSP456'],
				agriculturalExpertiseCert: ['AEC123', 'AEC456'],
				specialization: ['Livestock', 'Poultry'],
				yearsOfExperience: 10,
			};

			const result = AGROEXPERTKycSchema.safeParse(AGROEXPERTData);
			expect(result.success).toBe(true);
		});
	});

	describe('Validation Errors', () => {
		it('should reject invalid farmer data', () => {
			const invalidFarmerData = {
				fullName: 'Jo', // Too short
				country: 'N', // Too short
				address: '123', // Too short
				idNumber: '123', // Too short
				phone: '123', // Too short
				hederaWallet: '0.0.123', // Too short
				type: 'FARMER' as const,
			};

			const result = farmerKycSchema.safeParse(invalidFarmerData);
			expect(result.success).toBe(false);
		});

		it('should reject distributor data without business license', () => {
			const invalidDistributorData = {
				fullName: 'John Doe',
				country: 'Nigeria',
				address: '123 Main Street, Lagos',
				idNumber: '1234567890',
				phone: '+2341234567890',
				hederaWallet: '0.0.123456789012345678901234567890',
				type: 'DISTRIBUTOR' as const,
				// Missing businessLicense (required)
			};

			const result = distributorKycSchema.safeParse(invalidDistributorData);
			expect(result.success).toBe(false);
		});

		it('should reject transporter data without vehicle registrations', () => {
			const invalidTransporterData = {
				fullName: 'John Doe',
				country: 'Nigeria',
				address: '123 Main Street, Lagos',
				idNumber: '1234567890',
				phone: '+2341234567890',
				hederaWallet: '0.0.123456789012345678901234567890',
				type: 'TRANSPORTER' as const,
				vehicleRegistrations: [], // Empty array (should have at least one)
				insurancePolicy: 'INS123456789',
				drivingLicense: 'DL987654321',
			};

			const result = transporterKycSchema.safeParse(invalidTransporterData);
			expect(result.success).toBe(false);
		});

		it('should reject AGROEXPERT data without professional license', () => {
			const invalidAGROEXPERTData = {
				fullName: 'Dr. John Doe',
				country: 'Nigeria',
				address: '123 Main Street, Lagos',
				idNumber: '1234567890',
				phone: '+2341234567890',
				hederaWallet: '0.0.123456789012345678901234567890',
				type: 'AGROEXPERT' as const,
				// Missing professionalLicense (required)
			};

			const result = AGROEXPERTKycSchema.safeParse(invalidAGROEXPERTData);
			expect(result.success).toBe(false);
		});
	});

	describe('Discriminated Union Schema', () => {
		it('should validate any role type with kycSchema', () => {
			const farmerData = {
				fullName: 'John Doe',
				country: 'Nigeria',
				address: '123 Main Street, Lagos',
				idNumber: '1234567890',
				phone: '+2341234567890',
				hederaWallet: '0.0.123456789012345678901234567890',
				type: 'FARMER' as const,
				farmSize: 50,
			};

			const distributorData = {
				fullName: 'Jane Smith',
				country: 'Nigeria',
				address: '456 Business Ave, Lagos',
				idNumber: '0987654321',
				phone: '+2340987654321',
				hederaWallet: '0.0.987654321098765432109876543210',
				type: 'DISTRIBUTOR' as const,
				businessLicense: 'BL123456789',
			};

			const farmerResult = kycSchema.safeParse(farmerData);
			const distributorResult = kycSchema.safeParse(distributorData);

			expect(farmerResult.success).toBe(true);
			expect(distributorResult.success).toBe(true);
		});

		it('should reject invalid role type', () => {
			const invalidData = {
				fullName: 'John Doe',
				country: 'Nigeria',
				address: '123 Main Street, Lagos',
				idNumber: '1234567890',
				phone: '+2341234567890',
				hederaWallet: '0.0.123456789012345678901234567890',
				type: 'INVALID_ROLE' as any,
			};

			const result = kycSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('Role-specific Requirements', () => {
		it('should handle optional fields correctly', () => {
			const minimalFarmerData = {
				fullName: 'John Doe',
				country: 'Nigeria',
				address: '123 Main Street, Lagos',
				idNumber: '1234567890',
				phone: '+2341234567890',
				hederaWallet: '0.0.123456789012345678901234567890',
				type: 'FARMER' as const,
				// All optional fields omitted
			};

			const result = farmerKycSchema.safeParse(minimalFarmerData);
			expect(result.success).toBe(true);
		});

		it('should validate array fields', () => {
			const farmerWithArrays = {
				fullName: 'John Doe',
				country: 'Nigeria',
				address: '123 Main Street, Lagos',
				idNumber: '1234567890',
				phone: '+2341234567890',
				hederaWallet: '0.0.123456789012345678901234567890',
				type: 'FARMER' as const,
				certifications: ['Organic Farming', 'Sustainable Agriculture'],
				cropTypes: ['Rice', 'Maize', 'Cassava'],
			};

			const result = farmerKycSchema.safeParse(farmerWithArrays);
			expect(result.success).toBe(true);
		});
	});
});
