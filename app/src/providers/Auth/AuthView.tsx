import React, { useEffect, useMemo } from "react";
import useAuth from "./auth";
import { useNavigate } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
  redirect?: boolean;
  redirectTo?: string;
  showForUnauthenticated?: boolean;
}

/** AuthView component */
const AuthView: React.FC<Props> = ({
  children,
  redirect,
  redirectTo,
  showForUnauthenticated,
}) => {
  const { isAuthenticated, userId, token, tokenExpiry } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authorized =
      !!isAuthenticated && !!userId && !!token && !!tokenExpiry;

    const expired = authorized && new Date(tokenExpiry) < new Date();

    // Redirect when not authorized (and not showing for unauthenticated users)
    if (redirect && !showForUnauthenticated && !authorized) {
      navigate(redirectTo || "/login");
    }
    // Redirect when authenticated but showing for unauthenticated users
    else if (redirect && showForUnauthenticated && authorized) {
      navigate(redirectTo || "/");
    }
    // Logout when authenticated user expires
    else if (authorized && expired) {
      navigate("/logout");
    }
  }, [
    isAuthenticated,
    navigate,
    redirect,
    redirectTo,
    showForUnauthenticated,
    token,
    tokenExpiry,
    userId,
  ]);

  const shouldRender = useMemo(() => {
    const authorized =
      !!isAuthenticated && !!userId && !!token && !!tokenExpiry;
    const expired = authorized && new Date(tokenExpiry) < new Date();

    if (expired) return false;

    const shouldRender = showForUnauthenticated ? !authorized : authorized;
    return shouldRender;
  }, [isAuthenticated, showForUnauthenticated, token, tokenExpiry, userId]);

  return shouldRender ? children : null;
};

export default AuthView;
