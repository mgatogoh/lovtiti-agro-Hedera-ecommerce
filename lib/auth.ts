// JWT-based authentication utilities
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const JWT_EXPIRATION = '7d'; // 7 days

export interface UserPayload {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any; // Index signature for JWT compatibility
}

export interface SessionData extends UserPayload {
    exp: number;
    iat: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token
 */
export async function createToken(payload: UserPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRATION)
        .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<SessionData | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as SessionData;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

/**
 * Get the current session from request
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionData | null> {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

/**
 * Set the auth cookie
 */
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Clear the auth cookie
 */
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<SessionData> {
    const session = await getSession();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return session;
}

/**
 * Check if user has a specific role
 */
export function hasRole(session: SessionData | null, role: string): boolean {
    return session?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(session: SessionData | null, roles: string[]): boolean {
    return session ? roles.includes(session.role) : false;
}
