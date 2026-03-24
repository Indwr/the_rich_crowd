import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HISTORY_ENDPOINT_X3_STAKING,
  postConvertAutoCompounding,
} from "../services/historyAPI";

export function useConvertAutoCompounding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postConvertAutoCompounding,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["history-list", HISTORY_ENDPOINT_X3_STAKING],
        type: "active",
      });
    },
  });
}
