import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const checkAdminStatus = async (userId: string) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase configuration');
            setIsAdmin(false);
            return;
        }

        try {
            console.log('Checking admin status (failsafe fetch)...');

            // 1. Setup timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            // 2. Direct REST API call
            const response = await fetch(
                `${supabaseUrl}/rest/v1/admin_users?user_id=eq.${userId}&select=user_id`,
                {
                    method: 'GET',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error('Failsafe admin check failed:', response.status);
                // Fallback to library if fetch failed (though unlikely if fetch is working)
                const { data } = await supabase
                    .from('admin_users')
                    .select('user_id')
                    .eq('user_id', userId)
                    .single();
                setIsAdmin(!!data);
                return;
            }

            const data = await response.json();
            console.log('Admin status response:', data);
            setIsAdmin(data && data.length > 0);

        } catch (error: any) {
            console.error('Error in failsafe checkAdminStatus:', error);
            // If it's a timeout OR network error, we don't want to hang forever
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        // Verificar sesión actual
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await checkAdminStatus(session.user.id);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        };

        initSession();

        // Escuchar cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await checkAdminStatus(session.user.id);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signOut = async () => {
        console.log('Signing out (failsafe)...');

        // 1. Clear local state immediately
        setUser(null);
        setSession(null);
        setIsAdmin(false);

        // 2. Clear Supabase local storage keys manually (failsafe)
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) localStorage.removeItem(key);
        });

        // 3. Try server sign out (don't let it block URL redirect)
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Server sign out failed (ignoring):', error);
        }

        // 4. Force hard redirect
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, isAdmin, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
