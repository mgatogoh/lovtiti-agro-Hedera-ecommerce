import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import { logUserLogin } from '@/utils/userActivityLogger';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                role: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Log login
        logUserLogin(user.id, user.role, user.email, {
            loginMethod: 'local',
            timestamp: new Date().toISOString(),
        });

        // Create JWT token
        const token = await createToken({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
        });

        // Set cookie
        await setAuthCookie(token);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Login failed' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
