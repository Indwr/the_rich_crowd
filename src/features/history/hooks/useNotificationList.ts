import { useQuery } from "@tanstack/react-query";
import { fetchNotificationList } from "../services/historyAPI";
import type { HistoryRecord } from "../services/historyAPI";

const STALE_MS = 30 * 1000;
const GC_MS = 10 * 60 * 1000;

export const NOTIFICATION_QUERY_KEY = ["notification-list"] as const;

export function useNotificationList({
  currentPage,
  pageSize,
}: {
  currentPage: number;
  pageSize: number;
}) {
  const safePage = Math.max(1, currentPage);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  const query = useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, safePage, safePageSize],
    queryFn: () => fetchNotificationList({ skip, limit: safePageSize }),
    placeholderData: (previousData) => previousData,
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
  });

  return {
    rows: (query.data?.data ?? []) as HistoryRecord[],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
  };
}
