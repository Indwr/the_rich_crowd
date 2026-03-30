import { type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { userKey } from "src/utils/constants";

interface PreviewProtectedRouteProps {
  children: ReactElement;
  allowInPreview?: boolean;
}

const PreviewProtectedRoute = ({ children, allowInPreview = false }: PreviewProtectedRouteProps) => {
  const profileRaw = Cookies.get(userKey);
  let isPreview = false;
  if (profileRaw) {
    try {
      const profile = JSON.parse(profileRaw) as { previewUserId?: string };
      isPreview = Boolean(profile?.previewUserId);
    } catch (_error) {
      isPreview = false;
    }
  }

  if (isPreview && !allowInPreview) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PreviewProtectedRoute;
