import { useCallback } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/store/redux';
import { logoutUser } from 'src/slices/reducers/auth.reducer';
import { tokenKey, userKey } from 'src/utils/constants';
import { apiSlice } from 'src/slices/apis/app.api';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    Cookies.remove(tokenKey);
    Cookies.remove(userKey);
    dispatch(logoutUser());
    dispatch(apiSlice.util.resetApiState());
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  return { logout };
};
