import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

export type HistoryEndpoint =
  | "user/x2/deposit/history"
  | "user/x2/holding/history"
  | "user/x2/activation/upgrade/history"
  | "user/x3/deposit/history"
  | "user/x3/staking/history"
  | "user/x3/compounding/history"
  | "notification/get_notifications";

/** Matches backend `GET /v1/notification/get_notifications` */
export const NOTIFICATION_LIST_ENDPOINT: HistoryEndpoint = "notification/get_notifications";

/** Stable endpoint keys for React Query + callers (matches backend routes). */
export const HISTORY_ENDPOINT_X3_STAKING: HistoryEndpoint = "user/x3/staking/history";

/**
 * Standard API envelope from backend (SUCCESS / ERROR in AppConstants.js).
 * Example: { statusCode, status, message, data }
 */
export interface ApiEnvelope<T = unknown> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

export interface HistoryRecord {
  id: number | string;
  subject?: string;
  text?: string;
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
  converted?: number;
}

export interface HistoryApiResponse extends ApiEnvelope<HistoryRecord[]> {
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

function parseEnvelopeOrThrow<T>(
  payload: Partial<ApiEnvelope<T>> & { message?: string },
  response: Response
): ApiEnvelope<T> {
  const fallback = "Request failed.";
  const msg =
    typeof payload.message === "string" && payload.message.length > 0
      ? payload.message
      : fallback;
  if (!response.ok || payload.status === false) {
    throw new Error(msg);
  }
  return {
    statusCode: payload.statusCode ?? response.status,
    status: true,
    message: typeof payload.message === "string" ? payload.message : "Success",
    data: (payload.data ?? []) as T,
  };
}

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

  const payload = (await response.json().catch(() => ({}))) as Partial<HistoryApiResponse>;

  if (!response.ok) {
    throw new Error(
      typeof payload.message === "string" && payload.message.length > 0
        ? payload.message
        : await extractErrorMessage(response)
    );
  }

  if (payload.status === false) {
    throw new Error(payload.message ?? "Failed to fetch history.");
  }

  return payload as HistoryApiResponse;
};

/**
 * Notifications list — backend returns 400 when empty; treat as zero rows for UX.
 */
export const fetchNotificationList = async ({
  skip = 0,
  limit = 10,
}: {
  skip?: number;
  limit?: number;
}): Promise<HistoryApiResponse> => {
  const safeSkip = Math.max(0, skip);
  const safeLimit = Math.max(1, limit);
  const response = await fetch(
    `${getBaseApiUrl()}${NOTIFICATION_LIST_ENDPOINT}?skip=${encodeURIComponent(String(safeSkip))}&limit=${encodeURIComponent(String(safeLimit))}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const payload = (await response.json().catch(() => ({}))) as Partial<HistoryApiResponse> & {
    message?: string;
  };

  if (!response.ok) {
    const msg = (payload.message ?? "").toLowerCase();
    if (
      response.status === 400 &&
      (msg.includes("no notification") ||
        msg.includes("data not found") ||
        msg.includes("not found"))
    ) {
      return {
        statusCode: 200,
        status: true,
        message: "Success",
        data: [],
        totalCount: 0,
        totalSum: 0,
      };
    }
    throw new Error(
      typeof payload.message === "string" && payload.message.length > 0
        ? payload.message
        : "Failed to fetch notifications."
    );
  }

  if (payload.status === false) {
    throw new Error(payload.message ?? "Failed to fetch notifications.");
  }

  return payload as HistoryApiResponse;
};

export interface NotificationStatusData {
  hasUnread: boolean;
}

/** GET /v1/notification/status — bell dot when `hasUnread`. */
export const fetchNotificationStatus =
  async (): Promise<NotificationStatusData> => {
    const response = await fetch(`${getBaseApiUrl()}notification/status`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const payload = (await response.json().catch(() => ({}))) as Partial<
      ApiEnvelope<NotificationStatusData>
    >;
    const env = parseEnvelopeOrThrow<NotificationStatusData>(payload, response);
    return env.data ?? { hasUnread: false };
  };

/** POST /v1/notification/mark_seen — call when user opens notifications page. */
export const markNotificationsSeen = async (): Promise<void> => {
  const response = await fetch(`${getBaseApiUrl()}notification/mark_seen`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({}),
  });
  const payload = (await response.json().catch(() => ({}))) as Partial<
    ApiEnvelope<unknown>
  >;
  parseEnvelopeOrThrow<unknown>(payload, response);
};

export const postConvertAutoCompounding = async (body: {
  year: number;
  amount: number;
}): Promise<ApiEnvelope<unknown[]>> => {
  const response = await fetch(`${getBaseApiUrl()}user/convert-auto-compounding`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      year: body.year,
      amount: body.amount,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as Partial<
    ApiEnvelope<unknown[]>
  >;
  return parseEnvelopeOrThrow<unknown[]>(payload, response);
};
