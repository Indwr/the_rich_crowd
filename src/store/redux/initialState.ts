export const initialState: IRootState = {
  user: {
    fullName: '',
    email: '',
    role: '',
    token: '',
  },
};

export interface IUserData {
  fullName: string;
  email: string;
  role: string;
  token: string;
}

interface IRootState {
  user: IUserData;
}