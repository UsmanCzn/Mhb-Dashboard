import React from "react";
import { Navigate, Outlet } from "react-router-dom"; 

import { useAuth, useUser } from "providers/authProvider";

export function AuthLayout() { 
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? ( 
    <Navigate to="/" />
  ) : (
     <Outlet/>
  );
}