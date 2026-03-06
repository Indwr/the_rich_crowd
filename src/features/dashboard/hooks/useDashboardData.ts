import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/redux";
import {
  fetchDashboardProfile,
  type DashboardProfileResponse,
  fetchUserPackages,
  type UserPackage,
} from "../services/dashboardAPI";
import { setDashboardCache } from "src/slices/reducers/dashboard.reducer";

let inFlightDashboardLoad: Promise<{
  profileResponse: DashboardProfileResponse;
  packages: UserPackage[];
}> | null = null;

const fetchDashboardBundle = async () => {
  if (!inFlightDashboardLoad) {
    inFlightDashboardLoad = Promise.all([
      fetchDashboardProfile(),
      fetchUserPackages(),
    ])
      .then(([profileResponse, packagesResponse]) => ({
        profileResponse,
        packages: packagesResponse?.data ?? [],
      }))
      .finally(() => {
        inFlightDashboardLoad = null;
      });
  }

  return inFlightDashboardLoad;
};

export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  const cachedDashboardResponse = useAppSelector(
    (state) => state.dashboard.dashboardResponse
  );
  const cachedUserPackages = useAppSelector((state) => state.dashboard.userPackages);

  const [dashboardResponse, setDashboardResponse] = useState<DashboardProfileResponse | null>(
    cachedDashboardResponse
  );
  const [userPackages, setUserPackages] = useState<UserPackage[]>(cachedUserPackages ?? []);
  const [isDashboardLoading, setIsDashboardLoading] = useState(!cachedDashboardResponse);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const hasCache = Boolean(cachedDashboardResponse);

  useEffect(() => {
    if (cachedDashboardResponse) {
      setDashboardResponse(cachedDashboardResponse);
    }
    setUserPackages(cachedUserPackages ?? []);
    if (cachedDashboardResponse) {
      setIsDashboardLoading(false);
    }
  }, [cachedDashboardResponse, cachedUserPackages]);

  const loadDashboardData = useCallback(async (options?: { force?: boolean; showLoading?: boolean }) => {
    const shouldForce = Boolean(options?.force);
    const shouldShowLoading = Boolean(options?.showLoading);

    if (!shouldForce && hasCache) {
      return;
    }

    if (shouldShowLoading) {
      setIsDashboardLoading(true);
    }
    setDashboardError(null);

    try {
      const { profileResponse, packages } = await fetchDashboardBundle();
      setDashboardResponse(profileResponse);
      setUserPackages(packages);
      dispatch(
        setDashboardCache({
          dashboardResponse: profileResponse,
          userPackages: packages,
        })
      );
    } catch (error: any) {
      setDashboardError(error?.message ?? "Failed to load dashboard data.");
    } finally {
      setIsDashboardLoading(false);
    }
  }, [dispatch, hasCache]);

  useEffect(() => {
    void loadDashboardData({ force: true, showLoading: !hasCache });
  }, [hasCache, loadDashboardData]);

  return {
    dashboardResponse,
    userPackages,
    isDashboardLoading,
    dashboardError,
    refetchDashboard: () => loadDashboardData({ force: true }),
  };
};
