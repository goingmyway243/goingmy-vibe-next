'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Software developer | Tech enthusiast | Coffee lover ☕',
    avatar: undefined,
    followers: ['2', '3'],
    following: ['2'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'janedoe',
    displayName: 'Jane Doe',
    bio: 'Designer & Creative | UX/UI enthusiast',
    avatar: undefined,
    followers: ['1'],
    following: ['1', '3'],
    createdAt: new Date('2024-02-20')
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        userData.createdAt = new Date(userData.createdAt);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('mockUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find mock user
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // In a real app, verify password here
    // For mock, accept any password
    
    setUser(foundUser);
    localStorage.setItem('mockUser', JSON.stringify(foundUser));
  };

  const signup = async (data: SignupData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = MOCK_USERS.find(
      u => u.email === data.email || u.username === data.username
    );
    
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      bio: '',
      avatar: undefined,
      followers: [],
      following: [],
      createdAt: new Date()
    };

    // Add to mock database
    MOCK_USERS.push(newUser);
    
    setUser(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
