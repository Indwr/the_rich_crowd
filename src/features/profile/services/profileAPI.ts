import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export interface UserProfileData {
  user_id: string;
  eth_address: string;
  sponser_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  state: string;
}

export interface UserProfileResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: UserProfileData;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  state: string;
}

const PROFILE_ENDPOINT = "user/profile";

const getBaseApiUrl = () => {
  const raw = env.API_URL ?? "/v1/";
  return raw.endsWith("/") ? raw : `${raw}/`;
};

const getAuthHeaders = () => {
  const token = Cookies.get(tokenKey);
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const extractErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.message ?? "Profile request failed.";
  } catch (_error) {
    return "Profile request failed.";
  }
};

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await fetch(`${getBaseApiUrl()}${PROFILE_ENDPOINT}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as UserProfileResponse;
};

export const updateUserProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfileResponse> => {
  const response = await fetch(`${getBaseApiUrl()}${PROFILE_ENDPOINT}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as UserProfileResponse;
};

