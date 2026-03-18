import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export type HistoryEndpoint =
  | "user/x2/deposit/history"
  | "user/x2/holding/history"
  | "user/x2/activation/upgrade/history"
  | "user/x3/deposit/history"
  | "user/x3/staking/history"
  | "user/x3/compounding/history";

export interface HistoryRecord {
  id: number | string;
  user_id?: number | string;
  amount?: number | string;
  type?: string;
  created_at?: string;
  updated_at?: string;
  status?: string | number;
  holding_time?: string | number;
  percent?: string | number;
  isActive?: boolean;
  withCompound?: boolean;
  hash?: string;
  description?: string;
}

export interface HistoryApiResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: HistoryRecord[];
  totalCount: number;
  totalSum?: number | string;
}

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
    return data?.message ?? "Failed to fetch history.";
  } catch (_error) {
    return "Failed to fetch history.";
  }
};

export const fetchHistoryList = async ({
  endpoint,
  skip = 0,
  limit = 10,
}: {
  endpoint: HistoryEndpoint;
  skip?: number;
  limit?: number;
}): Promise<HistoryApiResponse> => {
  const safeSkip = Math.max(0, skip);
  const safeLimit = Math.max(1, limit);
  const skipParam = encodeURIComponent(String(safeSkip));
  const limitParam = encodeURIComponent(String(safeLimit));

  const response = await fetch(
    `${getBaseApiUrl()}${endpoint}?skip=${skipParam}&limit=${limitParam}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as HistoryApiResponse;
};
