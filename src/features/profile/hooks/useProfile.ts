import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "src/store/redux";
import {
  fetchDashboardProfile,
  type UserPackage,
} from "src/features/dashboard/services/dashboardAPI";
import { setDashboardCache } from "src/slices/reducers/dashboard.reducer";
import { resolveCountryDialOption } from "../constants/countryDialCodes";
import { normalizeDobForApi } from "../utils/dobFormat";
import {
  fetchUserProfile,
  updateUserProfile,
  type UpdateProfilePayload,
} from "../services/profileAPI";
import { hydrateProfile, setProfileField } from "src/slices/reducers/profile.reducer";

async function refreshDashboardInfoInBackground(
  dispatch: ReturnType<typeof useAppDispatch>,
  userPackages: UserPackage[]
) {
  try {
    const dashboardResponse = await fetchDashboardProfile();
    dispatch(
      setDashboardCache({
        dashboardResponse,
        userPackages,
      })
    );
  } catch {
    /* background refresh — ignore */
  }
}

export const profileQueryKey = ["user-profile"] as const;

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const identity = useAppSelector((state) => state.profile.identity);
  const form = useAppSelector((state) => state.profile.form);
  const userPackages = useAppSelector((state) => state.dashboard.userPackages);

  const profileQuery = useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchUserProfile,
  });

  useEffect(() => {
    if (profileQuery.data?.data) {
      dispatch(hydrateProfile(profileQuery.data.data));
    }
  }, [dispatch, profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateUserProfile(payload),
    onSuccess: (response) => {
      if (response?.data) {
        dispatch(hydrateProfile(response.data));
      }
      void queryClient.invalidateQueries({ queryKey: profileQueryKey });
      void refreshDashboardInfoInBackground(dispatch, userPackages);
      toast.success(response?.message || "Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const onFieldChange = (field: keyof typeof form, value: string) => {
    dispatch(setProfileField({ field, value }));
  };

  const submitProfile = async () => {
    const dial =
      form.country_code?.trim() ||
      resolveCountryDialOption(undefined).dial;
    await updateMutation.mutateAsync({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      dob: normalizeDobForApi(form.dob),
      city: form.city,
      state: form.state,
      country: form.country,
      country_code: dial,
      pin_code: String(form.pin_code ?? ""),
      district: form.district,
    });
  };

  return {
    identity,
    form,
    onFieldChange,
    submitProfile,
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    isUpdating: updateMutation.isPending,
    error: (profileQuery.error as Error | null)?.message ?? null,
  };
};

