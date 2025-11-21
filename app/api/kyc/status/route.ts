import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        // 🔐 Authenticate using JWT
        const session = await requireAuth(); 
        // session = { id, email, role, firstName, lastName, iat, exp }

        const url = new URL(req.url);
        const type = url.searchParams.get("type") as "BUYER" | "FARMER" | null;

        if (!type) {
            return NextResponse.json(
                { error: "Missing type" },
                { status: 400 }
            );
        }

        // 👤 Fetch the current user using the same email stored in JWT
        const user = await prisma.user.findUnique({
            where: { email: session.email }
        });

        if (!user) {
            return NextResponse.json({ status: "NONE" });
        }

        // 🔎 Fetch the user KYC profile
        const profile = await prisma.profile.findUnique({
            where: {
                userId_type: {
                    userId: user.id,
                    type,
                },
            },
        });

        return NextResponse.json({
            status: profile?.kycStatus ?? "NONE",
            profile,
        });

    } catch (err) {
        console.error("KYC status error", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
