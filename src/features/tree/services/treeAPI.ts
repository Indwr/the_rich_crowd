import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export interface TeamTreeNode {
  node_id: number | string;
  position?: "left" | "right" | string;
  created_at?: string;
  left_business?: number;
  right_business?: number;
  children?: TeamTreeNode[];
}

export interface TeamTreeResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    tree_json: TeamTreeNode;
  };
}

const TEAM_TREE_ENDPOINT = "team/tree";

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
    return data?.message ?? "Failed to fetch tree data.";
  } catch (_error) {
    return "Failed to fetch tree data.";
  }
};

export const fetchTeamTree = async (
  nodeId: string | number = ""
): Promise<TeamTreeResponse> => {
  const nodeIdParam = encodeURIComponent(String(nodeId ?? ""));
  const response = await fetch(
    `${getBaseApiUrl()}${TEAM_TREE_ENDPOINT}?node_id=${nodeIdParam}`,
    {
    method: "GET",
    headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as TeamTreeResponse;
};

