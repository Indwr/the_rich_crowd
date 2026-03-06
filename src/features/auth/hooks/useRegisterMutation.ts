import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { tokenKey, userKey } from 'src/utils/constants';
import { useAppDispatch } from 'src/store/redux';
import { setWalletSession } from 'src/slices/reducers/auth.reducer';
import { walletRegister } from '../services/authAPI';

interface RegisterArgs {
  sponsorId: string;
  name: string;
  walletAddress: string;
}

export const useRegisterMutation = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ sponsorId, name, walletAddress }: RegisterArgs) => {
      const response = await walletRegister({
        sponsor_id: sponsorId,
        name,
        wallet_address: walletAddress,
      });

      const token = response?.data?.token;
      if (!token) {
        throw new Error('Token missing in register response.');
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
    },
  });
};
