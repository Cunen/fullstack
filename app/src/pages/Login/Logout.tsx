import React, { useEffect } from "react";
import useAuth from "../../providers/Auth/auth";
import { useNavigate } from "react-router-dom";

export const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout().finally(() => {
      navigate("/login");
    });
  }, [logout, navigate]);

  return <>Logging out...</>;
};

export default Logout;
