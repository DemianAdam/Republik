import { PropsWithChildren, ReactNode } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { hasRole, UserRole } from "../types/userTypes";
import { AdminLayoutContext } from "../../../types/AdminLayoutContext";

interface RoleGuardProps {
    requiredRole: UserRole;
    fallbackComponent?: ReactNode | null
    andCondition?: boolean
    orCondition?: boolean
}

export default function RoleGuard({
    requiredRole,
    fallbackComponent,
    andCondition = true,
    orCondition = false,
    children,
}: PropsWithChildren<RoleGuardProps>) {
    const { user } = useOutletContext<AdminLayoutContext>();

    if ((hasRole(user, requiredRole) && andCondition) || orCondition) {
        return children ?? <Outlet />;
    }

    return fallbackComponent;
}