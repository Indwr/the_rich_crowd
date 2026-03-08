import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export interface DirectUser {
  user_id: string;
  eth_address: string;
  directs: number;
  total_package: number;
}

export interface TeamDirectsResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: DirectUser[];
  totalCount: number;
}

const TEAM_DIRECTS_ENDPOINT = "team/directs";

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
    return data?.message ?? "Failed to fetch directs.";
  } catch (_error) {
    return "Failed to fetch directs.";
  }
};

export const fetchTeamDirects = async ({
  userId = "",
  type = "userId",
  search = "",
  skip = 0,
  limit = 10,
}: {
  userId?: string | number;
  type?: "userId" | "wallet";
  search?: string;
  skip?: number;
  limit?: number;
} = {}): Promise<TeamDirectsResponse> => {
  const userIdParam = encodeURIComponent(String(userId ?? ""));
  const typeParam = encodeURIComponent(String(type ?? "userId"));
  const searchParam = encodeURIComponent(String(search ?? ""));
  const skipParam = encodeURIComponent(String(skip));
  const limitParam = encodeURIComponent(String(limit));
  const response = await fetch(
    `${getBaseApiUrl()}${TEAM_DIRECTS_ENDPOINT}?userId=${userIdParam}&type=${typeParam}&search=${searchParam}&skip=${skipParam}&limit=${limitParam}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as TeamDirectsResponse;
};

