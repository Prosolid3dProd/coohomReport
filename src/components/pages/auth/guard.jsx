import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useUser } from '../../../context';

const RedirectLogin = () => {
    const { user } = useUser();
    return user ? <Outlet /> : <Navigate to={'/Login'} />;
};

const AdminGuard = () => {
    const { user } = useUser();
    return user?.role === 'admin' ? <Outlet /> : <Navigate to={'/Dashboard/Presupuestos'} replace />;
};

export {
    RedirectLogin,
    AdminGuard,
};
