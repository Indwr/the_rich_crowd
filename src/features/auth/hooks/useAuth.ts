import { useState } from 'react';
import Cookies from 'js-cookie';
import * as authAPI from '../services/authAPI';
import { tokenKey, userKey } from 'src/utils/constants';
import { useAppDispatch } from 'src/store/redux';
import { setPreviewSession, setWalletSession } from 'src/slices/reducers/auth.reducer';

interface AuthenticateWalletArgs {
  walletAddress: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticateWallet = async ({
    walletAddress,
  }: AuthenticateWalletArgs) => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const response = await authAPI.walletLogin({
        wallet_address: walletAddress
      });

      const token = response?.data?.token;
      if (!token) {
        throw new Error('Token missing in login response.');
      }

      Cookies.set(tokenKey, token);
      Cookies.set(userKey, JSON.stringify({ walletAddress }));

      dispatch(
        setWalletSession({
          token,
          walletAddress,
        })
      );

      return response;
    } catch (err: any) {
      const messageText = err?.message ?? 'Wallet authentication failed.';
      setError(messageText);
      throw new Error(messageText);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const authenticatePreview = async (userId: string) => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const response = await authAPI.previewLogin({
        userid: userId,
      });

      const token = response?.data?.token;
      if (!token) {
        throw new Error('Token missing in preview response.');
      }

      Cookies.set(tokenKey, token);
      Cookies.set(userKey, JSON.stringify({ previewUserId: userId }));

      dispatch(
        setPreviewSession({
          token,
        })
      );

      return response;
    } catch (err: any) {
      const messageText = err?.message ?? 'Preview authentication failed.';
      setError(messageText);
      throw new Error(messageText);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return { authenticateWallet, authenticatePreview, isAuthenticating, error };
};