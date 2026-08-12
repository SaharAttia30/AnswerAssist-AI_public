// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'user' | 'partner' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailConfirmed: boolean;
  phone?: string | null; 
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
  const meta = (supabaseUser.user_metadata || {}) as {
    full_name?: string;
    role?: UserRole;
    phone?: string; 
  };

  const email = supabaseUser.email ?? '';
  const name = meta.full_name || (email ? email.split('@')[0] : '') || 'User';
  const allowedRoles: UserRole[] = ['user', 'partner', 'admin'];
  const metaRole = meta.role;
  const role: UserRole =
    metaRole && allowedRoles.includes(metaRole) ? metaRole : 'user';

  return {
    id: supabaseUser.id,
    email,
    name,
    role,
    emailConfirmed: !!supabaseUser.email_confirmed_at,
    phone: meta.phone ?? null,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setUser(mapSupabaseUserToUser(data.user));
      }
      setIsAuthReady(true);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
   
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error('Supabase login error:', error?.message);
      return false;
    }

    const mapped = mapSupabaseUserToUser(data.user);

    if (!mapped.emailConfirmed) {
      await supabase.auth.signOut();
      return false;
    }

    setUser(mapped);
    return true;
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user', // default role for all new signups
        },
      },
    });

    if (error || !data.user) {
      console.error('Supabase signUp error:', error?.message);
      return false;
    }
    return true;
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };
  const isVerified = !!user?.emailConfirmed;
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isVerified,
        isAuthReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const signInWithGoogle = async () => {
  const origin = window.location.origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google sign-in error', error);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
