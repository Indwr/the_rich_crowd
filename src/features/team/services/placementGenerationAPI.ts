import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export interface PlacementGenerationUser {
  downline_id: string;
  level: number;
  first_name: string | null;
  total_package: number;
  created_at: string;
}

export interface PlacementGenerationResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: PlacementGenerationUser[];
  totalCount: number;
}

export interface PlacementGenerationParams {
  level: number;
  skip: number;
  limit: number;
}

const PLACEMENT_GENERATION_ENDPOINT = "team/placement-generation";

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
    return data?.message ?? "Failed to fetch placement generation data.";
  } catch (_error) {
    return "Failed to fetch placement generation data.";
  }
};

export const fetchPlacementGeneration = async ({
  level,
  skip,
  limit,
}: PlacementGenerationParams): Promise<PlacementGenerationResponse> => {
  const query = new URLSearchParams({
    level: String(level),
    skip: String(skip),
    limit: String(limit),
  }).toString();

  const response = await fetch(
    `${getBaseApiUrl()}${PLACEMENT_GENERATION_ENDPOINT}?${query}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as PlacementGenerationResponse;
};
