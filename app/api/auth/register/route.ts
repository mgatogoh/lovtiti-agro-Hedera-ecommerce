import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { logUserRegistration } from '@/utils/userActivityLogger';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email, password, firstName, lastName, role } = await request.json();

        // Validate input
        if (!email || !password || !role) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            }
        });

        // Log registration
        logUserRegistration(user.id, user.role, user.email, {
            firstName: user.firstName,
            lastName: user.lastName,
            registrationMethod: 'local',
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

        return NextResponse.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Registration failed' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
