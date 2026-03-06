import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export interface DashboardUser {
  user_id: string;
  wallet_address?: string;
  eth_address?: string;
  sponser_id: string;
  directs: number;
  package_amount: number;
  total_package: number;
}

export interface DashboardSummary {
  direct_referral: number;
  hybrid_turbo_bonus: number;
  trc_special: number;
  staking_income: number;
  direct_referralX3: number;
  level_incomeX3: number;
  reward: number;
  royalty: number;
  levelIncome: number;
  total_income: number;
  total_income_x3: number;
  todayTX6Income: number;
  todayTX14Income: number;
  todayLevelIncome: number;
  holdingWallet: number;
  holdingWalletx3: number;
  left_business: number;
  right_business: number;
  left_team: number;
  right_team: number;
  totalStaked: number;
  totalCompound: number;
}

export interface X3Summary {
  x3_left_business: number;
  x3_right_business: number;
  x3_compound_left_business: number;
  x3_compound_right_business: number;
}

export interface DashboardProfileResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    user: DashboardUser;
    x3_summary: X3Summary;
    dashboard_summary: DashboardSummary;
  };
}

export interface UserPackage {
  plan: string;
  price: number;
  status: 0 | 1 | 2;
}

export interface UserPackagesResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: UserPackage[];
}

// Keep endpoint in one place so mapping/updating stays simple.
export const DASHBOARD_PROFILE_ENDPOINT = "user/info";
export const USER_PACKAGES_ENDPOINT = "user/packages";

const getBaseApiUrl = () => {
  const raw = env.API_URL ?? "/v1/";
  return raw.endsWith("/") ? raw : `${raw}/`;
};

const extractErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.message ?? "Failed to fetch dashboard data.";
  } catch (_error) {
    return "Failed to fetch dashboard data.";
  }
};

export const fetchDashboardProfile = async (): Promise<DashboardProfileResponse> => {
  const token = Cookies.get(tokenKey);
  const response = await fetch(`${getBaseApiUrl()}${DASHBOARD_PROFILE_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload: DashboardProfileResponse = await response.json();

  if (payload?.data?.user) {
    payload.data.user.wallet_address =
      payload.data.user.wallet_address ?? payload.data.user.eth_address;
  }

  return payload;
};

export const fetchUserPackages = async (): Promise<UserPackagesResponse> => {
  const token = Cookies.get(tokenKey);
  const response = await fetch(`${getBaseApiUrl()}${USER_PACKAGES_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as UserPackagesResponse;
};
