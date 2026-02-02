'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminDataManager } from '@/lib/adminData';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  enrolledCourses: string[];
  completedCourses: string[];
  certificates: string[];
  progress: Record<string, number>;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateProgress: (courseId: string, progress: number) => void;
  enrollInCourse: (courseId: string) => void;
  completeCourse: (courseId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage on mount - only on client side
    const initializeAuth = () => {
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem('skillnexis_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // Sync user data with admin system if user exists
            if (parsedUser.role === 'student') {
              syncUserWithAdminSystem(parsedUser);
            }
          }
        } catch (error) {
          console.error('Error loading user from localStorage:', error);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const syncUserWithAdminSystem = (userData: User) => {
    try {
      // Check if user exists in admin system, if not add them
      const adminUsers = adminDataManager.getUsers();
      const existingUser = adminUsers.find(u => u.email === userData.email);
      
      if (!existingUser) {
        // Add user to admin system
        adminDataManager.addUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          enrolledCourses: userData.enrolledCourses,
          completedCourses: userData.completedCourses,
          certificates: userData.certificates,
          progress: userData.progress,
          joinedDate: new Date().toISOString(),
          lastActive: new Date().toISOString()
        });
      } else {
        // Update existing user's last active time
        adminDataManager.updateUser(existingUser.id, {
          lastActive: new Date().toISOString(),
          enrolledCourses: userData.enrolledCourses,
          completedCourses: userData.completedCourses,
          certificates: userData.certificates,
          progress: userData.progress
        });
      }
    } catch (error) {
      console.error('Error syncing user with admin system:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Admin credentials validation (secure)
      const isAdmin = email === 'admin@skillnexis.com' && password === '@looKa_Achar04**';
      
      // For demo purposes, allow any valid email for students
      if (email !== 'admin@skillnexis.com' || isAdmin) {
        // Check if user exists in admin system
        const adminUsers = adminDataManager.getUsers();
        let existingUser = adminUsers.find(u => u.email === email);
        
        let mockUser: User;
        
        if (existingUser && !isAdmin) {
          // Use existing user data from admin system
          mockUser = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            enrolledCourses: existingUser.enrolledCourses,
            completedCourses: existingUser.completedCourses,
            certificates: existingUser.certificates,
            progress: existingUser.progress
          };
          
          // Update last active
          adminDataManager.updateUser(existingUser.id, {
            lastActive: new Date().toISOString()
          });
        } else {
          // Create new user
          mockUser = {
            id: Math.random().toString(36).substring(2, 11),
            name: isAdmin ? 'Admin' : (email.split('@')[0] || 'User'),
            email: email,
            role: isAdmin ? 'admin' : 'student',
            enrolledCourses: [],
            completedCourses: [],
            certificates: [],
            progress: {}
          };
          
          // Add to admin system if student
          if (!isAdmin) {
            adminDataManager.addUser({
              id: mockUser.id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
              enrolledCourses: mockUser.enrolledCourses,
              completedCourses: mockUser.completedCourses,
              certificates: mockUser.certificates,
              progress: mockUser.progress,
              joinedDate: new Date().toISOString(),
              lastActive: new Date().toISOString()
            });
          }
        }

        setUser(mockUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('skillnexis_user', JSON.stringify(mockUser));
        }
        setIsLoading(false);
        router.push(isAdmin ? '/admin' : '/dashboard');
      } else {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      alert(errorMessage);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Input validation
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Prevent admin email registration
      if (email === 'admin@skillnexis.com') {
        throw new Error('This email address is reserved');
      }
      
      // Check if user already exists
      const adminUsers = adminDataManager.getUsers();
      const existingUser = adminUsers.find(u => u.email === email.toLowerCase().trim());
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'student',
        enrolledCourses: [],
        completedCourses: [],
        certificates: [],
        progress: {}
      };

      // Add to admin system
      adminDataManager.addUser({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        enrolledCourses: mockUser.enrolledCourses,
        completedCourses: mockUser.completedCourses,
        certificates: mockUser.certificates,
        progress: mockUser.progress,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      });

      setUser(mockUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillnexis_user', JSON.stringify(mockUser));
      }
      setIsLoading(false);
      router.push('/dashboard');
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      alert(errorMessage);
      throw error;
    }
  };

  const updateProgress = (courseId: string, progress: number) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        progress: {
          ...user.progress,
          [courseId]: progress
        }
      };
      
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillnexis_user', JSON.stringify(updatedUser));
      }
      
      // Update in admin system
      adminDataManager.updateUser(user.id, {
        progress: updatedUser.progress,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const enrollInCourse = (courseId: string) => {
    if (!user || user.enrolledCourses.includes(courseId)) return;
    
    try {
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, courseId],
        progress: {
          ...user.progress,
          [courseId]: 0
        }
      };
      
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillnexis_user', JSON.stringify(updatedUser));
      }
      
      // Update in admin system
      adminDataManager.enrollUserInCourse(user.id, courseId);
      adminDataManager.updateUser(user.id, {
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const completeCourse = (courseId: string) => {
    if (!user || user.completedCourses.includes(courseId)) return;
    
    try {
      const updatedUser = {
        ...user,
        completedCourses: [...user.completedCourses, courseId],
        certificates: [...user.certificates, courseId],
        progress: {
          ...user.progress,
          [courseId]: 100
        }
      };
      
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillnexis_user', JSON.stringify(updatedUser));
      }
      
      // Update in admin system
      adminDataManager.completeCourse(user.id, courseId);
      adminDataManager.updateUser(user.id, {
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error completing course:', error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('skillnexis_user');
      }
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still try to navigate even if there's an error
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      updateProgress, 
      enrollInCourse, 
      completeCourse 
    }}>
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