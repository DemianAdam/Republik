import { PropsWithChildren } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { hasRole, UserRole } from "../types/userTypes";
import { AdminLayoutContext } from "../../../types/AdminLayoutContext";

interface RoleGuardProps {
    requiredRole: UserRole;
}

export default function RoleGuard({
    requiredRole,
    children,
}: PropsWithChildren<RoleGuardProps>) {
    const { user } = useOutletContext<AdminLayoutContext>();

    if (!hasRole(user, requiredRole)) {
        return <Navigate to="/admin" replace />;
    }

    return children ?? <Outlet />;
}