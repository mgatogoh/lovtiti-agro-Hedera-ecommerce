type UssdParams = {
	sessionId?: string;
	serviceCode?: string;
	phoneNumber?: string;
	text: string;
};

type UssdSession = {
	role?: string;
	kycData: Record<string, string>;
	step: number;
};

// In-memory session storage (in production, use Redis or database)
// Use a global variable to persist across test runs
declare global {
	var ussdSessions: Map<string, UssdSession> | undefined;
}

const sessions = globalThis.ussdSessions || (globalThis.ussdSessions = new Map<string, UssdSession>());

export async function handleUssd(params: UssdParams): Promise<string> {
	const input = params.text.trim();
	const sessionId = params.sessionId || 'default';
	const parts = input.split("*");
	const level = parts.length;

	// Initialize session if not exists
	if (!sessions.has(sessionId)) {
		sessions.set(sessionId, {
			kycData: {},
			step: 0
		});
	}

	const session = sessions.get(sessionId)!;

	if (!input) {
		return "CON Welcome to Lovtiti Agro Mart\n1. Browse listings\n2. My orders\n3. Help\n4. KYC Registration\n5. Track Order";
	}

	// Browse listings
	if (parts[0] === "1") {
		if (level === 1) return "CON Browse Products\n1. Grains\n2. Vegetables\n3. Fruits\n4. Livestock";
		if (level === 2) return "END Browse results sent via SMS. Visit lovitti.agro/mobile";
		return "END Coming soon: category results via SMS link.";
	}

	// My orders
	if (parts[0] === "2") {
		return "END Order tracking sent via SMS. Visit lovitti.agro/mobile for details.";
	}

	// Help
	if (parts[0] === "3") {
		return "END For help, call 0800-AGRO or visit lovitti.agro/help";
	}

	// KYC Registration
	if (parts[0] === "4") {
		if (level === 1) {
			return "CON Select Role\n1. Farmer\n2. Distributor\n3. Transporter\n4. Buyer\n5. AGROEXPERT";
		}

		if (level === 2) {
			const roleMap: Record<string, string> = {
				"1": "FARMER",
				"2": "DISTRIBUTOR",
				"3": "TRANSPORTER",
				"4": "BUYER",
				"5": "AGROEXPERT"
			};

			const selectedRole = roleMap[parts[1]];
			if (!selectedRole) {
				return "END Invalid selection. Please try again.";
			}

			session.role = selectedRole;
			session.step = 1;
			session.kycData = {};

			const roleNames: Record<string, string> = {
				"FARMER": "Farmer",
				"DISTRIBUTOR": "Distributor",
				"TRANSPORTER": "Transporter",
				"BUYER": "Buyer",
				"AGROEXPERT": "AGROEXPERT"
			};

			const roleName = roleNames[session.role];
			return `CON ${roleName} Registration\nEnter Full Name:`;
		}

		// Handle role-specific KYC flows for level > 2
		if (session.role === "FARMER") {
			return handleFarmerKyc(parts, session);
		} else if (session.role === "DISTRIBUTOR") {
			return handleDistributorKyc(parts, session);
		} else if (session.role === "TRANSPORTER") {
			return handleTransporterKyc(parts, session);
		} else if (session.role === "BUYER") {
			return handleBuyerKyc(parts, session);
		} else if (session.role === "AGROEXPERT") {
			return handleAGROEXPERTKyc(parts, session);
		} else {
			return "END Invalid role selection. Please try again.";
		}

	}

	// Track Order
	if (parts[0] === "5") {
		return "CON Enter Order ID:\n(Format: ORD-XXXXXX)";
	}

	return "END Invalid selection. Please try again.";
}

function handleFarmerKyc(parts: string[], session: UssdSession): string {
	const level = parts.length;
	const step = level - 2; // Subtract 2 for role selection and KYC selection

	switch (step) {
		case 1:
			session.kycData.fullName = parts[level - 1];
			return "CON Enter Phone Number:";
		case 2:
			session.kycData.phone = parts[level - 1];
			return "CON Enter Country:";
		case 3:
			session.kycData.country = parts[level - 1];
			return "CON Enter Farm Address:";
		case 4:
			session.kycData.address = parts[level - 1];
			return "CON Enter ID Number:";
		case 5:
			session.kycData.idNumber = parts[level - 1];
			return "CON Enter Farm Size (acres):";
		case 6:
			session.kycData.farmSize = parts[level - 1];
			return "CON Enter Crop Types:\n(comma separated)";
		case 7:
			session.kycData.cropTypes = parts[level - 1];
			return "CON Enter Hedera Wallet:";
		case 8:
			session.kycData.hederaWallet = parts[level - 1];
			// Submit KYC data
			console.log("Farmer KYC submitted:", { ...session.kycData, type: "FARMER" });
			return "END KYC submitted successfully! You'll receive SMS confirmation.";
		default: return "END Invalid step. Please start over.";
	}
}

function handleDistributorKyc(parts: string[], session: UssdSession): string {
	const level = parts.length;
	const step = level - 2;

	switch (step) {
		case 1:
			session.kycData.fullName = parts[level - 1];
			return "CON Enter Phone Number:";
		case 2:
			session.kycData.phone = parts[level - 1];
			return "CON Enter Country:";
		case 3:
			session.kycData.country = parts[level - 1];
			return "CON Enter Business Address:";
		case 4:
			session.kycData.address = parts[level - 1];
			return "CON Enter ID Number:";
		case 5:
			session.kycData.idNumber = parts[level - 1];
			return "CON Enter Business License:";
		case 6:
			session.kycData.businessLicense = parts[level - 1];
			return "CON Enter Tax ID (optional):";
		case 7:
			session.kycData.taxId = parts[level - 1];
			return "CON Enter Storage Capacity (tons):";
		case 8:
			session.kycData.storageCapacity = parts[level - 1];
			return "CON Enter Hedera Wallet:";
		case 9:
			session.kycData.hederaWallet = parts[level - 1];
			console.log("Distributor KYC submitted:", { ...session.kycData, type: "DISTRIBUTOR" });
			return "END KYC submitted successfully! You'll receive SMS confirmation.";
		default: return "END Invalid step. Please start over.";
	}
}

function handleTransporterKyc(parts: string[], session: UssdSession): string {
	const level = parts.length;
	const step = level - 2;

	switch (step) {
		case 1: return "CON Enter Phone Number:";
		case 2: session.kycData.phone = parts[level - 1]; return "CON Enter Country:";
		case 3: session.kycData.country = parts[level - 1]; return "CON Enter Base Address:";
		case 4: session.kycData.address = parts[level - 1]; return "CON Enter ID Number:";
		case 5: session.kycData.idNumber = parts[level - 1]; return "CON Enter Vehicle Registration:";
		case 6: session.kycData.vehicleRegistration = parts[level - 1]; return "CON Enter Insurance Policy:";
		case 7: session.kycData.insurancePolicy = parts[level - 1]; return "CON Enter Driving License:";
		case 8: session.kycData.drivingLicense = parts[level - 1]; return "CON Enter Fleet Size:";
		case 9: session.kycData.fleetSize = parts[level - 1]; return "CON Enter Hedera Wallet:";
		case 10:
			session.kycData.hederaWallet = parts[level - 1];
			console.log("Transporter KYC submitted:", { ...session.kycData, type: "TRANSPORTER" });
			return "END KYC submitted successfully! You'll receive SMS confirmation.";
		default: return "END Invalid step. Please start over.";
	}
}

function handleBuyerKyc(parts: string[], session: UssdSession): string {
	const level = parts.length;
	const step = level - 2;

	switch (step) {
		case 1: return "CON Enter Phone Number:";
		case 2: session.kycData.phone = parts[level - 1]; return "CON Enter Country:";
		case 3: session.kycData.country = parts[level - 1]; return "CON Enter Delivery Address:";
		case 4: session.kycData.address = parts[level - 1]; return "CON Enter ID Number:";
		case 5: session.kycData.idNumber = parts[level - 1]; return "CON Enter Business Type (optional):";
		case 6: session.kycData.businessType = parts[level - 1]; return "CON Enter Monthly Volume (kg):";
		case 7: session.kycData.monthlyVolume = parts[level - 1]; return "CON Enter Hedera Wallet:";
		case 8:
			session.kycData.hederaWallet = parts[level - 1];
			console.log("Buyer KYC submitted:", { ...session.kycData, type: "BUYER" });
			return "END KYC submitted successfully! You'll receive SMS confirmation.";
		default: return "END Invalid step. Please start over.";
	}
}

function handleAGROEXPERTKyc(parts: string[], session: UssdSession): string {
	const level = parts.length;
	const step = level - 2;

	switch (step) {
		case 1: return "CON Enter Phone Number:";
		case 2: session.kycData.phone = parts[level - 1]; return "CON Enter Country:";
		case 3: session.kycData.country = parts[level - 1]; return "CON Enter Practice Address:";
		case 4: session.kycData.address = parts[level - 1]; return "CON Enter ID Number:";
		case 5: session.kycData.idNumber = parts[level - 1]; return "CON Enter Professional License:";
		case 6: session.kycData.professionalLicense = parts[level - 1]; return "CON Enter Years of Experience:";
		case 7: session.kycData.yearsOfExperience = parts[level - 1]; return "CON Enter Specialization:";
		case 8: session.kycData.specialization = parts[level - 1]; return "CON Enter Hedera Wallet:";
		case 9:
			session.kycData.hederaWallet = parts[level - 1];
			console.log("AGROEXPERT KYC submitted:", { ...session.kycData, type: "AGROEXPERT" });
			return "END KYC submitted successfully! You'll receive SMS confirmation.";
		default: return "END Invalid step. Please start over.";
	}
}
