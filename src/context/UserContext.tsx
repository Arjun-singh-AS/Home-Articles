'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  email: string;
  password: string;
  phone: string;
  createdAt: Date;
  addresses: string[];
  isVerified?: boolean; // Optional verification status
  otp?: string;         // Optional OTP
  otpExpires?: Date;    // Optional OTP expiration date
}

// Define UserContextType for type-checking the context value
type UserContextType = {
  user: User | null;       // User object (can be null initially)
  isLoadingUser: boolean;  // Loading state for user data
  userError: string | null; // Error state for user data
  setHasIdToken: React.Dispatch<React.SetStateAction<string | null | undefined>>; // Function to update 'hasidtoke'
};

// Initialize the UserContext with a null default value
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Single user or null
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Renamed loading state
  const [userError, setUserError] = useState<string | null>(null); // Renamed error state
  const [hasIdToken, setHasIdToken] = useState<string | null>(); // State to track token-related updates
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken'); // Fetch JWT token from localStorage

      if (token) {
        try {
          // Decode the JWT token
          const decodedToken = jwt.decode(token) as { id: string; email: string; phone: string } | null;

          if (decodedToken && decodedToken.id) {
            const { id } = decodedToken; // Extract id from decoded token

            // Fetch user details using the id from decoded token
            const response = await fetch(`/api/finduser?id=${(id)}`);
            console.log(response)
            if (!response.ok) {
              throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            setUser(data.user); // Assuming the API returns the user in this format
          } else {
            throw new Error('Invalid token');
          }
        } catch (err) {
          if (err instanceof Error) {
            setUserError(err.message); // Access error message
          } else {
            setUserError("An unknown error occurred");
          }
        } finally {
          setIsLoadingUser(false);
        }
      } else {
        setUserError("Token not found");
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, [hasIdToken]); // Fetch user data when 'hasIdToken' changes

  return (
    <UserContext.Provider value={{ setHasIdToken, user, isLoadingUser, userError }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the UserContext and use its values/functions
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
