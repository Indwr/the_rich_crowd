import { env } from 'src/utils/env';

export interface WalletLoginPayload {
  wallet_address: string;
}

export interface WalletRegisterPayload {
  sponsor_id: string;
  trainer_id: string;
  name: string;
  wallet_address: string;
}

export interface PreviewLoginPayload {
  userid: string;
}

export interface CheckSponsorPayload {
  sponser_id: string;
}

export interface CheckTrainerPayload {
  trainer_id: string;
  sponser_id: string;
}

interface WalletLoginResponse {
  status: boolean;
  message: string;
  data?: {
    token: string;
  };
}

interface CheckSponsorResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data?: {
    name: string;
  };
}

interface CheckTrainerResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data?: {
    status: boolean;
  };
}

const getBaseApiUrl = () => {
  const raw = env.API_URL ?? '/v1/';
  return raw.endsWith('/') ? raw : `${raw}/`;
};

const extractErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.message ?? 'Authentication failed.';
  } catch (_error) {
    return 'Authentication failed.';
  }
};

export const walletLogin = async (payload: WalletLoginPayload): Promise<WalletLoginResponse> => {
  const response = await fetch(`${getBaseApiUrl()}auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
};

export const walletRegister = async (
  payload: WalletRegisterPayload
): Promise<WalletLoginResponse> => {
  const response = await fetch(`${getBaseApiUrl()}auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
};

export const previewLogin = async (payload: PreviewLoginPayload): Promise<WalletLoginResponse> => {
  const response = await fetch(`${getBaseApiUrl()}auth/loginByUserId`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
};

export const checkSponsorName = async (
  payload: CheckSponsorPayload
): Promise<CheckSponsorResponse> => {
  const response = await fetch(`${getBaseApiUrl()}auth/check-sponsor-name`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
};

export const checkTrainerId = async (
  payload: CheckTrainerPayload
): Promise<CheckTrainerResponse> => {
  const response = await fetch(`${getBaseApiUrl()}auth/check-trainer-id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
};