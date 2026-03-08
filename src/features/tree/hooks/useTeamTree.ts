import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "src/store/redux";
import { fetchTeamTree } from "../services/treeAPI";
import { setTreeCache } from "src/slices/reducers/tree.reducer";

export const teamTreeQueryKey = ["team-tree"] as const;

export const useTeamTree = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const cachedTree = useAppSelector((state) => state.tree.treeJson);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");

  const query = useQuery({
    queryKey: [...teamTreeQueryKey, selectedNodeId],
    queryFn: () => fetchTeamTree(selectedNodeId),
    initialData: selectedNodeId === "" && cachedTree
      ? {
          statusCode: 200,
          status: true,
          message: "Tree fetched successfully",
          data: { tree_json: cachedTree },
        }
      : undefined,
  });

  useEffect(() => {
    if (query.data?.data?.tree_json) {
      dispatch(setTreeCache(query.data.data.tree_json));
    }
  }, [dispatch, query.data]);

  const selectNode = useCallback(
    async (nodeId: string | number) => {
      const nextNodeId = String(nodeId ?? "");
      if (nextNodeId === selectedNodeId) {
        await query.refetch();
        return;
      }
      setSelectedNodeId(nextNodeId);
    },
    [query, selectedNodeId]
  );

  const resetTree = useCallback(async () => {
    setSelectedNodeId("");
    await queryClient.invalidateQueries({ queryKey: teamTreeQueryKey });
  }, [queryClient]);

  const refetchTree = async () => {
    await queryClient.invalidateQueries({ queryKey: [...teamTreeQueryKey, selectedNodeId] });
  };

  return {
    tree: query.data?.data?.tree_json ?? null,
    selectedNodeId,
    selectNode,
    resetTree,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: (query.error as Error | null)?.message ?? null,
    refetchTree,
  };
};

