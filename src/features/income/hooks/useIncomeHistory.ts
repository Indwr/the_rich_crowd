import { useQuery } from "@tanstack/react-query";
import {
  fetchIncomeList,
  type IncomeId,
  type IncomeRecord,
} from "../services/incomeAPI";

const INCOME_STALE_TIME_MS = 30 * 1000;
const INCOME_GC_TIME_MS = 10 * 60 * 1000;

interface UseIncomeHistoryOptions {
  incomeId: IncomeId;
  incomeType?: string;
  currentPage: number;
  pageSize: number;
}

export const useIncomeHistory = ({
  incomeId,
  incomeType,
  currentPage,
  pageSize,
}: UseIncomeHistoryOptions) => {
  const safePage = Math.max(1, currentPage);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  const query = useQuery({
    queryKey: ["income-history", incomeId, incomeType ?? "", safePage, safePageSize],
    queryFn: () =>
      fetchIncomeList({
        incomeId,
        incomeType,
        skip,
        limit: safePageSize,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: INCOME_STALE_TIME_MS,
    gcTime: INCOME_GC_TIME_MS,
    refetchOnWindowFocus: false,
  });

  const rows: IncomeRecord[] = query.data?.data ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const totalAmount = rows.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

  return {
    rows,
    totalCount,
    totalAmount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
  };
};
