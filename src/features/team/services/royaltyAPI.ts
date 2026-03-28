import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export interface RoyaltyUser {
  id: number | null;
  user_id: number | null;
}

export interface RoyaltyPool {
  pool: string;
  total_users: number;
  users: RoyaltyUser[];
}

export interface RoyaltyResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    royaltyUsers: RoyaltyPool[];
    totalIncome: Array<{
      total_amount: number;
    }>;
  };
}

interface FetchRoyaltyParams {
  year?: string;
  month?: string;
}

const ROYALTY_ENDPOINT = "team/royalty";

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
    return data?.message ?? "Failed to fetch royalty achievers.";
  } catch (_error) {
    return "Failed to fetch royalty achievers.";
  }
};

export const fetchRoyalty = async (
  params: FetchRoyaltyParams = {}
): Promise<RoyaltyResponse> => {
  const query = new URLSearchParams();
  if (params.year) {
    query.set("year", params.year);
  }
  if (params.month) {
    query.set("month", params.month);
  }

  const url = `${getBaseApiUrl()}${ROYALTY_ENDPOINT}${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as RoyaltyResponse;
};
