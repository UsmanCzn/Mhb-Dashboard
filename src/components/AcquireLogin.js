import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth, useUser } from 'providers/authProvider';

export function AcquireLogin() {
    const { isAuthenticated, userId, role, userRole } = useAuth();

    // console.log(userRole,userId,"ue====____>.");
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
