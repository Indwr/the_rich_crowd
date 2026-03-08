import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export interface GenerationUser {
  node_id: number;
  total_package: number;
  created_at: string;
}

export interface GenerationResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    levelUsers: Record<string, GenerationUser[]>;
  };
}

const GENERATION_ENDPOINT = "team/generation";

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
    return data?.message ?? "Failed to fetch generation data.";
  } catch (_error) {
    return "Failed to fetch generation data.";
  }
};

export const fetchGeneration = async (): Promise<GenerationResponse> => {
  const response = await fetch(`${getBaseApiUrl()}${GENERATION_ENDPOINT}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as GenerationResponse;
};

