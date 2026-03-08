import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export type IncomeId = "X2" | "X3";

export interface IncomeRecord {
  id: number;
  user_id: string;
  amount: string | number;
  type: string;
  uniqueId: string | null;
  address: string | null;
  description: string | null;
  hash: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IncomeListResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: IncomeRecord[];
  totalCount: number;
}

interface FetchIncomeListParams {
  incomeId: IncomeId;
  incomeType?: string;
  skip?: number;
  limit?: number;
}

const INCOME_ENDPOINT = "income";

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

const buildIncomeUrl = ({
  incomeId,
  incomeType,
  skip = 0,
  limit = 10,
}: FetchIncomeListParams) => {
  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  if (incomeType) {
    // Support both keys while backend finalizes query naming.
    query.set("incomeType", incomeType);
    query.set("type", incomeType);
  }

  return `${getBaseApiUrl()}${INCOME_ENDPOINT}/${incomeId}?${query.toString()}`;
};

export const fetchIncomeList = async (
  params: FetchIncomeListParams
): Promise<IncomeListResponse> => {
  const response = await fetch(buildIncomeUrl(params), {
    method: "GET",
    headers: getAuthHeaders(),
  });

  let payload: Partial<IncomeListResponse> & { message?: string };
  try {
    payload = (await response.json()) as Partial<IncomeListResponse> & {
      message?: string;
    };
  } catch (_error) {
    payload = {};
  }

  if (!response.ok) {
    const message = payload?.message ?? "Failed to fetch income list.";
    const isNoData = /no income/i.test(message);
    if (isNoData) {
      return {
        statusCode: 200,
        status: true,
        message,
        data: [],
        totalCount: 0,
      };
    }
    throw new Error(message);
  }

  return {
    statusCode: Number(payload.statusCode ?? response.status),
    status: Boolean(payload.status ?? true),
    message: payload.message ?? "Success",
    data: Array.isArray(payload.data) ? payload.data : [],
    totalCount: Number(payload.totalCount ?? 0),
  };
};
