import { NextResponse } from 'next/server';
import { clearAuthCookie, getSession } from '@/lib/auth';
import { logUserLogout } from '@/utils/userActivityLogger';

export async function POST() {
    try {
        // Get session before clearing
        const session = await getSession();

        if (session) {
            // Log logout
            logUserLogout(session.id, session.role, session.email, {
                logoutMethod: 'manual',
                timestamp: new Date().toISOString(),
            });
        }

        // Clear auth cookie
        await clearAuthCookie();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Logout failed' },
            { status: 500 }
        );
    }
}
