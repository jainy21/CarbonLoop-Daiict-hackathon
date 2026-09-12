import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthResponse } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization: string;
    facilityId?: string;
  }) => Promise<User>;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => Promise<User>;
}

export const DEMO_ACCOUNTS: Record<UserRole, { email: string; name: string; org: string; facilityId?: string }> = {
  waste_generator: {
    email: 'generator@carbonloop.demo',
    name: 'Gujarat Agro Producer Cooperative',
    org: 'Gujarat Agro FPO Cluster (Ahmedabad)',
  },
  facility_operator: {
    email: 'facility@carbonloop.demo',
    name: 'Sanand Biochar Plant Manager',
    org: 'BioChar Plant A (Sanand Industrial Eco-Park)',
    facilityId: 'fac-biochar-a',
  },
  municipality: {
    email: 'municipality@carbonloop.demo',
    name: 'Ahmedabad Municipal Climate Cell',
    org: 'AMC Waste Diversion & Environment Wing',
  },
  admin: {
    email: 'admin@carbonloop.demo',
    name: 'CarbonLoop Global Administrator',
    org: 'CarbonLoop Ecosystem Governance',
  },
};

const DEMO_PASSWORD = 'DemoPassword123!';
const TOKEN_KEY = 'carbonloop_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Login failed (${res.status})`);
      }

      const data: AuthResponse = await res.json();
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err: any) {
      // Local fallback for demo resiliency if server is offline
      const matchedRole = (Object.keys(DEMO_ACCOUNTS) as UserRole[]).find(
        (r) => DEMO_ACCOUNTS[r].email.toLowerCase() === email.toLowerCase()
      );

      if (matchedRole && password === DEMO_PASSWORD) {
        const fallbackUser: User = {
          id: `usr-${matchedRole}-1`,
          name: DEMO_ACCOUNTS[matchedRole].name,
          email: DEMO_ACCOUNTS[matchedRole].email,
          role: matchedRole,
          organization: DEMO_ACCOUNTS[matchedRole].org,
          facilityId: DEMO_ACCOUNTS[matchedRole].facilityId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(fallbackUser);
        return fallbackUser;
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization: string;
    facilityId?: string;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Registration failed (${res.status})`);
      }

      const authData: AuthResponse = await res.json();
      localStorage.setItem(TOKEN_KEY, authData.token);
      setToken(authData.token);
      setUser(authData.user);
      return authData.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const quickDemoLogin = async (role: UserRole): Promise<User> => {
    const demo = DEMO_ACCOUNTS[role];
    try {
      return await login(demo.email, DEMO_PASSWORD);
    } catch {
      const fallbackUser: User = {
        id: `usr-${role}-1`,
        name: demo.name,
        email: demo.email,
        role: role,
        organization: demo.org,
        facilityId: demo.facilityId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
