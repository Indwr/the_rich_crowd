import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useToastLoading = (isPending: boolean, message?: string) => {
  useEffect(() => {
    let toastId: any;

    if (isPending) toastId = toast.loading(message ?? 'Loading...');
    else return toastId && toast.dismiss(toastId);

    return () => toastId && toast.dismiss(toastId);
  }, [isPending]);
};