import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
	try {
		const { userId } = auth();
		if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		const url = new URL(req.url);
		const type = url.searchParams.get("type") as "BUYER" | "FARMER" | null;
		if (!type) return NextResponse.json({ error: "Missing type" }, { status: 400 });
		const user = await prisma.user.findUnique({ where: { email: `${userId}@clerk.local` } });
		if (!user) return NextResponse.json({ status: "NONE" });
		const profile = await prisma.profile.findUnique({ where: { userId_type: { userId: user.id, type } } });
		return NextResponse.json({ status: profile?.kycStatus ?? "NONE", profile });
	} catch (err) {
		console.error("KYC status error", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
