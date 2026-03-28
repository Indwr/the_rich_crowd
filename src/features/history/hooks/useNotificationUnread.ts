import { useQuery } from "@tanstack/react-query";
import { fetchNotificationStatus } from "../services/historyAPI";

const STALE_MS = 30 * 1000;
const GC_MS = 10 * 60 * 1000;

export const NOTIFICATION_UNREAD_QUERY_KEY = ["notification-unread"] as const;

export function useNotificationUnread() {
  const query = useQuery({
    queryKey: NOTIFICATION_UNREAD_QUERY_KEY,
    queryFn: async () => {
      const data = await fetchNotificationStatus();
      return data.hasUnread;
    },
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: true,
  });

  return {
    hasUnread: query.data ?? false,
    isLoading: query.isLoading,
  };
}
