import { type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'src/store/redux';

interface PreviewProtectedRouteProps {
  children: ReactElement;
}

const PreviewProtectedRoute = ({ children }: PreviewProtectedRouteProps) => {
  const loginMode = useAppSelector((state) => state.auth.loginMode);

  if (loginMode === 'preview') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PreviewProtectedRoute;
