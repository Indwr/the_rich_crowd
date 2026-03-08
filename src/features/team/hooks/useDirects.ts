import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "src/store/redux";
import { fetchTeamDirects } from "../services/directsAPI";
import { setDirectsCache } from "src/slices/reducers/directs.reducer";

export const directsQueryKey = ["team-directs"] as const;

export const useDirects = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const cachedList = useAppSelector((state) => state.directs.list);
  const cachedTotalCount = useAppSelector((state) => state.directs.totalCount);
  const cachedActiveUserId = useAppSelector((state) => state.directs.activeUserId);
  const [selectedUserId, setSelectedUserId] = useState<string>(cachedActiveUserId || "");
  const [searchType, setSearchType] = useState<"userId" | "wallet">("userId");
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const query = useQuery({
    queryKey: [
      ...directsQueryKey,
      selectedUserId,
      searchType,
      searchText,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      fetchTeamDirects({
        userId: selectedUserId,
        type: searchType,
        search: searchText,
        skip,
        limit: pageSize,
      }),
    placeholderData: (previousData) => previousData,
    initialData:
      selectedUserId === cachedActiveUserId && currentPage === 1 && cachedList.length > 0
        ? {
            statusCode: 200,
            status: true,
            message: "Success",
            data: cachedList,
            totalCount: cachedTotalCount,
          }
        : undefined,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(
        setDirectsCache({
          list: query.data.data ?? [],
          totalCount: query.data.totalCount ?? 0,
          activeUserId: selectedUserId,
        })
      );
    }
  }, [currentPage, dispatch, query.data, selectedUserId]);

  const viewByUserId = useCallback((userId: string | number) => {
    setSelectedUserId(String(userId ?? ""));
    setCurrentPage(1);
  }, []);

  const resetToRoot = useCallback(() => {
    setSelectedUserId("");
    setCurrentPage(1);
  }, []);

  const applySearch = useCallback(
    (nextType: "userId" | "wallet", nextSearch: string) => {
      setSearchType(nextType);
      setSearchText(nextSearch);
      setCurrentPage(1);
    },
    []
  );

  const refetchDirects = async () => {
    await queryClient.invalidateQueries({
      queryKey: [
        ...directsQueryKey,
        selectedUserId,
        searchType,
        searchText,
        currentPage,
        pageSize,
      ],
    });
  };

  return {
    directs: query.data?.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    selectedUserId,
    searchType,
    searchText,
    currentPage,
    pageSize,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
    viewByUserId,
    applySearch,
    setCurrentPage,
    resetToRoot,
    refetchDirects,
  };
};

