import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, WorkerProfile, EmployerProfile, getStreakLevel } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  phone: string;
  password: string;
  name: string;
  surname: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockWorker: WorkerProfile = {
  id: '1',
  email: 'isci@test.com',
  phone: '+994501234567',
  name: 'Əli',
  surname: 'Məmmədov',
  age: 22,
  role: 'worker',
  points: 150,
  streakDays: 8,
  streakLevel: 'gold',
  completedJobs: [],
  createdAt: new Date(),
};

const mockEmployer: EmployerProfile = {
  id: '2',
  email: 'isveren@test.com',
  phone: '+994502345678',
  name: 'Nigar',
  surname: 'Həsənova',
  role: 'employer',
  companyName: 'Event Pro MMC',
  postedJobs: [],
  previousWorkers: [
    { id: '3', name: 'Orxan Əliyev', daysWorked: 5, rating: 4.8 },
    { id: '4', name: 'Leyla Quliyeva', daysWorked: 3, rating: 4.5 },
  ],
  createdAt: new Date(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Mock login logic
    if (email === 'isci@test.com' && password === 'test123') {
      setUser(mockWorker);
      return true;
    }
    if (email === 'isveren@test.com' && password === 'test123') {
      setUser(mockEmployer);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      phone: data.phone,
      name: data.name,
      surname: data.surname,
      role: data.role,
      createdAt: new Date(),
    };

    if (data.role === 'worker') {
      const workerUser: WorkerProfile = {
        ...newUser,
        role: 'worker',
        points: 0,
        streakDays: 0,
        streakLevel: 'bronze',
        completedJobs: [],
      };
      setUser(workerUser);
    } else {
      const employerUser: EmployerProfile = {
        ...newUser,
        role: 'employer',
        postedJobs: [],
        previousWorkers: [],
      };
      setUser(employerUser);
    }
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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
