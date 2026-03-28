import { useQuery } from "@tanstack/react-query";
import { fetchRoyalty } from "../services/royaltyAPI";

interface UseRoyaltyParams {
  year?: string;
  month?: string;
}

export const useRoyalty = (params: UseRoyaltyParams = {}) => {
  const { year = "", month = "" } = params;
  const query = useQuery({
    queryKey: ["team-royalty", year, month],
    queryFn: () => fetchRoyalty({ year, month }),
  });

  return {
    pools: query.data?.data?.royaltyUsers ?? [],
    totalIncome: query.data?.data?.totalIncome ?? [],
    message: query.data?.message ?? "",
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
  };
};
