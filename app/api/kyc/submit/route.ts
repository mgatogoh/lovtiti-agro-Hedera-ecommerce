import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { kycSchema } from "@/utils/validators";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		const json = await req.json();
		const parsed = kycSchema.safeParse(json);
		if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

		const { fullName, country, address, idNumber, phone, hederaWallet, type } = parsed.data;

		// Map the type to the correct role enum
		const roleMapping: Record<string, string> = {
			"BUYER": "BUYER",
			"FARMER": "FARMER",
			"DISTRIBUTOR": "DISTRIBUTOR",
			"TRANSPORTER": "TRANSPORTER",
			"AGROEXPERT": "AGROEXPERT"
		};

		const userRole = roleMapping[type] || "FARMER";

		// Find or create user by Clerk userId email is not stored here; using userId in profiles
		// For simplicity, ensure user exists
		const user = await prisma.user.upsert({
			where: { email: `${userId}@clerk.local` },
			create: { email: `${userId}@clerk.local`, role: userRole as any },
			update: { role: userRole as any },
		});

		// Create profile with role-specific data
		const profile = await prisma.profile.upsert({
			where: { userId_type: { userId: user.id, type: type as any } },
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
				kycStatus: "PENDING" // Reset to pending when updating
			},
		});

		// Log role-specific KYC requirements for verification
		if (type === "DISTRIBUTOR") {
			const { businessLicense, warehouseCert, taxId, businessType, storageCapacity } = parsed.data;
			console.log("Distributor KYC:", { businessLicense, warehouseCert, taxId, businessType, storageCapacity });
		} else if (type === "TRANSPORTER") {
			const { vehicleRegistrations, insurancePolicy, drivingLicense, fleetSize, vehicleTypes } = parsed.data;
			console.log("Transporter KYC:", { vehicleRegistrations, insurancePolicy, drivingLicense, fleetSize, vehicleTypes });
		} else if (type === "AGROEXPERT") {
			const { professionalLicense, productSupplierPermits, agriculturalExpertiseCert, specialization, yearsOfExperience } = parsed.data;
			console.log("AgroExpert KYC:", { professionalLicense, productSupplierPermits, agriculturalExpertiseCert, specialization, yearsOfExperience });
		} else if (type === "FARMER") {
			const { landOwnership, certifications, farmSize, cropTypes } = parsed.data;
			console.log("Farmer KYC:", { landOwnership, certifications, farmSize, cropTypes });
		}

		return NextResponse.json({ ok: true, profile });
	} catch (err) {
		console.error("KYC submit error", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
