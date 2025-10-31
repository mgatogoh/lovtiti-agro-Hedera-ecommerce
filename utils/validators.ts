import { z } from "zod";

// Base KYC schema with common fields
const baseKycSchema = z.object({
	fullName: z.string().min(3),
	country: z.string().min(2),
	address: z.string().min(5),
	idNumber: z.string().min(5),
	phone: z.string().min(7),
	hederaWallet: z.string().min(10),
	type: z.enum(["BUYER", "FARMER", "DISTRIBUTOR", "TRANSPORTER", "AGROEXPERT"]),
});

// Role-specific KYC requirements
export const farmerKycSchema = baseKycSchema.extend({
	type: z.literal("FARMER"),
	landOwnership: z.string().optional(), // Land ownership documents
	certifications: z.array(z.string()).optional(), // Agricultural certifications
	farmSize: z.number().optional(), // Farm size in acres
	cropTypes: z.array(z.string()).optional(), // Types of crops grown
});

export const distributorKycSchema = baseKycSchema.extend({
	type: z.literal("DISTRIBUTOR"),
	businessLicense: z.string().min(1), // Business registration number
	warehouseCert: z.string().optional(), // Warehouse certification
	taxId: z.string().optional(), // Tax identification number
	businessType: z.string().optional(), // Type of distribution business
	storageCapacity: z.number().optional(), // Storage capacity in tons
});

export const transporterKycSchema = baseKycSchema.extend({
	type: z.literal("TRANSPORTER"),
	vehicleRegistrations: z.array(z.string()).min(1), // Vehicle registration numbers
	insurancePolicy: z.string().min(1), // Insurance policy number
	drivingLicense: z.string().min(1), // Driving license number
	fleetSize: z.number().optional(), // Number of vehicles
	vehicleTypes: z.array(z.string()).optional(), // Types of vehicles
});

export const buyerKycSchema = baseKycSchema.extend({
	type: z.literal("BUYER"),
	businessRegistration: z.string().optional(), // Business registration
	creditVerification: z.string().optional(), // Credit verification documents
	businessType: z.string().optional(), // Type of buying business
	monthlyVolume: z.number().optional(), // Expected monthly purchase volume
});

export const agroExpertKycSchema = baseKycSchema.extend({
	type: z.literal("AGROEXPERT"),
	professionalLicense: z.string().min(1), // Professional veterinary license
	productSupplierPermits: z.array(z.string()).optional(), // Product supplier permits
	agriculturalExpertiseCert: z.array(z.string()).optional(), // Agricultural expertise certifications
	specialization: z.array(z.string()).optional(), // Areas of specialization
	yearsOfExperience: z.number().optional(), // Years of experience
});

// Union type for all KYC schemas
export const kycSchema = z.discriminatedUnion("type", [
	farmerKycSchema,
	distributorKycSchema,
	transporterKycSchema,
	buyerKycSchema,
	agroExpertKycSchema,
]);

export const listingSchema = z.object({
	title: z.string().min(3),
	description: z.string().min(10),
	priceCents: z.number().int().positive(),
	currency: z.string().default("USD"),
});

export type KycInput = z.infer<typeof kycSchema>;
export type FarmerKycInput = z.infer<typeof farmerKycSchema>;
export type DistributorKycInput = z.infer<typeof distributorKycSchema>;
export type TransporterKycInput = z.infer<typeof transporterKycSchema>;
export type BuyerKycInput = z.infer<typeof buyerKycSchema>;
export type AgroExpertKycInput = z.infer<typeof agroExpertKycSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
