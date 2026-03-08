import { useQuery } from "@tanstack/react-query";
import { fetchPlacementGeneration } from "../services/placementGenerationAPI";

interface UsePlacementGenerationOptions {
  level: number;
  page: number;
  limit: number;
}

export const usePlacementGeneration = ({
  level,
  page,
  limit,
}: UsePlacementGenerationOptions) => {
  const safeLevel = Math.min(10, Math.max(1, level));
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  // Backend expects page-like skip value (1, 2, 3...), not row offset.
  const skip = safePage;

  const query = useQuery({
    queryKey: ["placement-generation", safeLevel, safePage, safeLimit],
    queryFn: () =>
      fetchPlacementGeneration({
        level: safeLevel,
        skip,
        limit: safeLimit,
      }),
    placeholderData: (previousData) => previousData,
  });

  return {
    users: query.data?.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    level: safeLevel,
    page: safePage,
    limit: safeLimit,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
  };
};
