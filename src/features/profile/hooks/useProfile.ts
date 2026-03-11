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

  const onFieldChange = (field: keyof typeof form, value: string) => {
    dispatch(setProfileField({ field, value }));
  };

  const submitProfile = async () => {
    await updateMutation.mutateAsync({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      dob: form.dob,
      city: form.city,
      state: form.state,
      country: form.country,
      country_code: form.country_code,
      pin_code: form.pin_code,
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

