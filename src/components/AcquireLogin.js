import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth, useUser } from 'providers/authProvider';

export function AcquireLogin() {
    const { isAuthenticated, userId, role, userRole } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
