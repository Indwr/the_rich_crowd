// features/auth/hooks/useAuth.ts
import { useState } from 'react';
import * as authAPI from '../services/authAPI';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const loginUser = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
  };

  const registerUser = async (userData: any) => {
    const data = await authAPI.register(userData);
    setUser(data.user);
  };

  return { user, loginUser, registerUser };
};