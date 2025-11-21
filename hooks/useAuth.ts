// Client-side authentication hook
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
}

interface AuthState {
    user: User | null;
    isLoaded: boolean;
    isSignedIn: boolean;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoaded: false,
        isSignedIn: false,
    });
    const router = useRouter();

    // Load user from session storage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const userStr = sessionStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setState({
                        user,
                        isLoaded: true,
                        isSignedIn: true,
                    });
                } else {
                    setState({
                        user: null,
                        isLoaded: true,
                        isSignedIn: false,
                    });
                }
            } catch (error) {
                console.error('Error loading user:', error);
                setState({
                    user: null,
                    isLoaded: true,
                    isSignedIn: false,
                });
            }
        };

        loadUser();

        // Listen for storage changes (for multi-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user') {
                loadUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const { user } = await response.json();

            // Store user in session storage
            sessionStorage.setItem('user', JSON.stringify(user));

            setState({
                user,
                isLoaded: true,
                isSignedIn: true,
            });

            return { success: true, user };
        } catch (error) {
            console.error('Sign in error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Login failed'
            };
        }
    }, []);

    const signUp = useCallback(async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    }) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            const { user } = await response.json();

            // Store user in session storage
            sessionStorage.setItem('user', JSON.stringify(user));

            setState({
                user,
                isLoaded: true,
                isSignedIn: true,
            });

            return { success: true, user };
        } catch (error) {
            console.error('Sign up error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Registration failed'
            };
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });

            // Clear session storage
            sessionStorage.removeItem('user');

            setState({
                user: null,
                isLoaded: true,
                isSignedIn: false,
            });

            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }, [router]);

    const updateUser = useCallback((updates: Partial<User>) => {
        setState(prev => {
            if (!prev.user) return prev;

            const updatedUser = { ...prev.user, ...updates };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));

            return {
                ...prev,
                user: updatedUser,
            };
        });
    }, []);

    return {
        user: state.user,
        isLoaded: state.isLoaded,
        isSignedIn: state.isSignedIn,
        signIn,
        signUp,
        signOut,
        updateUser,
    };
}

// Compatibility exports for Clerk migration
export function useUser() {
    const { user, isLoaded, isSignedIn } = useAuth();
    return {
        user: user ? {
            id: user.id,
            emailAddresses: [{ emailAddress: user.email }],
            firstName: user.firstName,
            lastName: user.lastName,
            publicMetadata: { role: user.role },
        } : null,
        isLoaded,
        isSignedIn,
    };
}
