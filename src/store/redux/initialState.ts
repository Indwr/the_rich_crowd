export const initialState: IRootState = {
  user: {
    fullName: '',
    email: '',
    role: '',
    token: '',
    walletAddress: '',
    loginMode: 'normal',
  },
};

export interface IUserData {
  fullName: string;
  email: string;
  role: string;
  token: string;
  walletAddress: string;
  loginMode: 'normal' | 'preview';
}

interface IRootState {
  user: IUserData;
}