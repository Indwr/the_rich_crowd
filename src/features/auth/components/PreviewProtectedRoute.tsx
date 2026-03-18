import { type ReactElement } from 'react';

interface PreviewProtectedRouteProps {
  children: ReactElement;
}

const PreviewProtectedRoute = ({ children }: PreviewProtectedRouteProps) => {
  // Temporary: preview restrictions are disabled for testing.
  return children;
};

export default PreviewProtectedRoute;
