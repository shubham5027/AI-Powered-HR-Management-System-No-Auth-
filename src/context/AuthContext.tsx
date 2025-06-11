import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// import { supabase } from '@/integrations/supabase/client';
// import { Session, User } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, position: string) => Promise<void>;
  logout: () => Promise<void>;
  session: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const [user, setUser] = useState<AuthUser | null>(null);
  // const [session, setSession] = useState<Session | null>(null);
  // const navigate = useNavigate();

  const value = {
    user: null,
    isAuthenticated: true, // Temporarily set to true to bypass auth
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    session: null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
