import { PropsWithChildren, ReactNode } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { UserPermission } from "../types/userTypes";
import { AdminLayoutContext } from "../../../types/AdminLayoutContext";
import { hasPermission } from "convex/users/functions";

interface PermissionGuardProps {
    requiredPermission: UserPermission;
    fallbackComponent?: ReactNode | null
    andCondition?: boolean
    orCondition?: boolean
}

export default function PermissionGuard({
    requiredPermission,
    fallbackComponent,
    andCondition = true,
    orCondition = false,
    children,
}: PropsWithChildren<PermissionGuardProps>) {
    const { user } = useOutletContext<AdminLayoutContext>();

    if ((hasPermission(user, requiredPermission) && andCondition) || orCondition) {
        return children ?? <Outlet />;
    }

    return fallbackComponent;
}