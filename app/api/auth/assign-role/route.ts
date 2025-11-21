import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { UserRole } from "@/utils/roleManager";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, userId: providedUserId } = body;

    // Get userId from JWT session or use provided userId (for signup flow)
    let userId = providedUserId;

    if (!userId) {
      const session = await requireAuth();
      userId = session.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - No user ID provided" }, { status: 401 });
    }

    if (!role || !['FARMER', 'BUYER', 'DISTRIBUTOR', 'TRANSPORTER', 'AGROEXPERT', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update the user's role in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any }
    });

    console.log(`Role ${role} assigned to user ${userId} in database`);

    return NextResponse.json({
      success: true,
      message: `Role ${role} assigned successfully`,
      role: role as UserRole,
      user: updatedUser
    });

  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
