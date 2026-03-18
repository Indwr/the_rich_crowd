import { useQuery } from "@tanstack/react-query";
import {
  fetchHistoryList,
  type HistoryEndpoint,
  type HistoryRecord,
} from "../services/historyAPI";

const HISTORY_STALE_TIME_MS = 30 * 1000;
const HISTORY_GC_TIME_MS = 10 * 60 * 1000;

export const useHistoryList = ({
  endpoint,
  currentPage,
  pageSize,
}: {
  endpoint: HistoryEndpoint;
  currentPage: number;
  pageSize: number;
}) => {
  const safePage = Math.max(1, currentPage);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  const query = useQuery({
    queryKey: ["history-list", endpoint, safePage, safePageSize],
    queryFn: () =>
      fetchHistoryList({
        endpoint,
        skip,
        limit: safePageSize,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: HISTORY_STALE_TIME_MS,
    gcTime: HISTORY_GC_TIME_MS,
    refetchOnWindowFocus: false,
  });

  return {
    rows: (query.data?.data ?? []) as HistoryRecord[],
    totalCount: query.data?.totalCount ?? 0,
    totalSum: query.data?.totalSum ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
  };
};
