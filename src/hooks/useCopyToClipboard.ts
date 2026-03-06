import { useCallback } from "react";
import toast from "react-hot-toast";

interface CopyOptions {
  successMessage?: string;
  errorMessage?: string;
}

const fallbackCopy = (value: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  const isCopied = document.execCommand("copy");
  document.body.removeChild(textArea);
  return isCopied;
};

export const useCopyToClipboard = () => {
  const copyText = useCallback(async (value: string, options?: CopyOptions) => {
    const successMessage = options?.successMessage ?? "Copied to clipboard.";
    const errorMessage = options?.errorMessage ?? "Unable to copy right now.";

    if (!value?.trim()) {
      toast.error("Nothing to copy.");
      return false;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const isCopied = fallbackCopy(value);
        if (!isCopied) throw new Error("Clipboard command failed");
      }

      toast.success(successMessage);
      return true;
    } catch (_error) {
      toast.error(errorMessage);
      return false;
    }
  }, []);

  return { copyText };
};
