import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "src/store/redux";
import { fetchGeneration, type GenerationUser } from "../services/generationAPI";
import { setGenerationCache } from "src/slices/reducers/generation.reducer";

export const generationQueryKey = ["team-generation"] as const;
const ROOT_LEVEL_KEY = "1";

export const useGeneration = () => {
  const dispatch = useAppDispatch();
  const cachedLevelUsers = useAppSelector((state) => state.generation.levelUsers);

  const query = useQuery({
    queryKey: generationQueryKey,
    queryFn: fetchGeneration,
    initialData:
      Object.keys(cachedLevelUsers).length > 0
        ? {
            statusCode: 200,
            status: true,
            message: "Generation fetched successfully",
            data: { levelUsers: cachedLevelUsers },
          }
        : undefined,
  });

  const levelUsers = useMemo(() => {
    const source = query.data?.data?.levelUsers ?? {};
    const filtered = { ...source };
    delete filtered[ROOT_LEVEL_KEY];
    return filtered;
  }, [query.data?.data?.levelUsers]);

  useEffect(() => {
    dispatch(setGenerationCache(levelUsers));
  }, [dispatch, levelUsers]);

  const rows = useMemo(() => {
    return Object.keys(levelUsers)
      .map((levelKey) => Number(levelKey))
      .filter((level) => !Number.isNaN(level))
      .sort((a, b) => a - b)
      .map((level) => {
        const levelKey = String(level);
        const actualUsers = levelUsers[levelKey] ?? [];
        return {
          level,
          teamRequired: actualUsers.length,
          team: Math.pow(2, level),
          users: actualUsers,
        };
      });
  }, [levelUsers]);

  const getUsersForLevel = (level: number): GenerationUser[] => {
    return levelUsers[String(level)] ?? [];
  };

  return {
    rows,
    levelCount: rows.length,
    levelUsers,
    getUsersForLevel,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
  };
};

