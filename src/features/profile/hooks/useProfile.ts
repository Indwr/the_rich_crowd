import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "src/store/redux";
import {
  fetchUserProfile,
  updateUserProfile,
  type UpdateProfilePayload,
} from "../services/profileAPI";
import { hydrateProfile, setProfileField } from "src/slices/reducers/profile.reducer";

export const profileQueryKey = ["user-profile"] as const;

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const identity = useAppSelector((state) => state.profile.identity);
  const form = useAppSelector((state) => state.profile.form);

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
      toast.success(response?.message || "Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const onFieldChange = (field: keyof UpdateProfilePayload, value: string) => {
    dispatch(setProfileField({ field, value }));
  };

  const submitProfile = async () => {
    await updateMutation.mutateAsync(form);
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

