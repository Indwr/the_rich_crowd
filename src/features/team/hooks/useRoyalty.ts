import { useQuery } from "@tanstack/react-query";
import { fetchRoyalty } from "../services/royaltyAPI";

export const royaltyQueryKey = ["team-royalty"] as const;

export const useRoyalty = () => {
  const query = useQuery({
    queryKey: royaltyQueryKey,
    queryFn: fetchRoyalty,
  });

  return {
    pools: query.data?.data ?? [],
    message: query.data?.message ?? "",
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
  };
};
