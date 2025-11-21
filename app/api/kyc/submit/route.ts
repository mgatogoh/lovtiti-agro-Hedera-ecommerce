import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { kycSchema } from "@/utils/validators";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        // 🔐 Authenticate user via JWT
        const session = await requireAuth();
        const userEmail = session.email; // derived from JWT
        const userIdFromToken = session.id;

        // Validate input
        const json = await req.json();
        const parsed = kycSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.format() },
                { status: 400 }
            );
        }

        const { fullName, country, address, idNumber, phone, hederaWallet, type } = parsed.data;

        // Map type to user roles
        const roleMapping: Record<string, string> = {
            BUYER: "BUYER",
            FARMER: "FARMER",
            DISTRIBUTOR: "DISTRIBUTOR",
            TRANSPORTER: "TRANSPORTER",
            AGROEXPERT: "AGROEXPERT"
        };

        const userRole = roleMapping[type] || "FARMER";

        // Ensure the authenticated user exists in DB
		const user = await prisma.user.findUnique({
			where: { email: userEmail }
		  });
		  
		  if (!user) {
			return NextResponse.json(
			  { error: "User account not found. Please log in again." },
			  { status: 404 }
			);
		  }
		  
		  // Continue with KYC logic...
		  

        // Upsert KYC profile
        const profile = await prisma.profile.upsert({
            where: { 
                userId_type: { 
                    userId: user.id, 
                    type: type as any 
                } 
            },
            create: {
                userId: user.id,
                type: type as any,
                fullName,
                country,
                address,
                idNumber,
                phone,
                hederaWallet,
                kycStatus: "PENDING"
            },
            update: {
                fullName,
                country,
                address,
                idNumber,
                phone,
                hederaWallet,
                kycStatus: "PENDING" // Reset on update
            },
        });

        // Optional: debug logs for role-specific KYC data
        switch (type) {
            case "DISTRIBUTOR":
                console.log("Distributor KYC:", {
                    businessLicense: parsed.data.businessLicense,
                    warehouseCert: parsed.data.warehouseCert,
                    taxId: parsed.data.taxId,
                    businessType: parsed.data.businessType,
                    storageCapacity: parsed.data.storageCapacity
                });
                break;

            case "TRANSPORTER":
                console.log("Transporter KYC:", {
                    vehicleRegistrations: parsed.data.vehicleRegistrations,
                    insurancePolicy: parsed.data.insurancePolicy,
                    drivingLicense: parsed.data.drivingLicense,
                    fleetSize: parsed.data.fleetSize,
                    vehicleTypes: parsed.data.vehicleTypes
                });
                break;

            case "AGROEXPERT":
                console.log("AgroExpert KYC:", {
                    professionalLicense: parsed.data.professionalLicense,
                    productSupplierPermits: parsed.data.productSupplierPermits,
                    agriculturalExpertiseCert: parsed.data.agriculturalExpertiseCert,
                    specialization: parsed.data.specialization,
                    yearsOfExperience: parsed.data.yearsOfExperience
                });
                break;

            case "FARMER":
                console.log("Farmer KYC:", {
                    landOwnership: parsed.data.landOwnership,
                    certifications: parsed.data.certifications,
                    farmSize: parsed.data.farmSize,
                    cropTypes: parsed.data.cropTypes
                });
                break;
        }

        return NextResponse.json({ ok: true, profile });
    } catch (err) {
        console.error("KYC submit error", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
