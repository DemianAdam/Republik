import { PropsWithChildren } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { hasRole, UserRole } from "../types/userTypes";
import { AdminLayoutContext } from "../../../types/AdminLayoutContext";

interface RouteRoleGuardProps {
    requiredRole: UserRole;
}

export default function RouteRoleGuard({
    requiredRole,
    children,
}: PropsWithChildren<RouteRoleGuardProps>) {
    const { user } = useOutletContext<AdminLayoutContext>();
    if (!hasRole(user, requiredRole)) {

        return <Navigate to="/admin" replace />;
    }

    return children ?? <Outlet />;
}