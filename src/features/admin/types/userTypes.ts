import type { Doc, Id } from "convex/_generated/dataModel";
import { WithoutSystemFields } from "convex/server";
import { PERMISSIONS as userPermissions, Permission, Role, VALID_ROLES, roleHierarchy as hierarchy, rolePermissions } from "convex/users/permissions";

export type User = Doc<"users">

export type CreateUser =
    WithoutSystemFields<User> & { password: string };

export const emptyCreateUser: CreateUser = {
    password: "",
    email: "",
    name: "",
    userName: "",
    role: VALID_ROLES.RRPP,
}

export type DeleteUser = {
    userId: Id<"users">
}

export type UpdateUser = {
    userId: Id<"users">,
} & CreateUser

export type UserRole = Role

export const ROLE_UI = {
    admin: {
        label: "Admin",
        style: {
            badgeColor: "bg-red-600/10 text-red-600 border-red-600/20",
            selectColor: "text-red-600 border-red-600/50 bg-red-600/10",
            textColor: "text-red-600",
            hoverText: "hover:text-red-600",
            borderColor: "border-red-600/50"
        }
    },
    rrpp: {
        label: "RRPP",
        style: {
            badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
            selectColor: "text-purple-500 border-purple-500/50 bg-purple-500/10",
            textColor: "text-purple-500",
            hoverText: "hover:text-purple-500",
            borderColor: "border-purple-500/50"
        }
    },
    door: {
        label: "Seguridad",
        style: {
            badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            selectColor: "text-blue-500 border-blue-500/50 bg-blue-500/10",
            textColor: "text-blue-500",
            hoverText: "hover:text-blue-500",
            borderColor: "border-blue-500/50"
        }
    }
} as const satisfies Record<UserRole, { label: string; style: Record<string, string> }>;

export const ROLES_ENUM = VALID_ROLES;
export const ROLES = Object.values(ROLES_ENUM) as readonly Role[];
export const createUserFromUpdateUser = (user: UpdateUser | null): CreateUser => {
    return user ?? emptyCreateUser;
}
export const roleHierarchy = hierarchy;

export function hasRole(
    user: User,
    requiredRole: Role,
): boolean {
    if (!user || !user.role || !(user.role in roleHierarchy)) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

export type UserPermission = Permission
export const PERMISSIONS = userPermissions
export function hasPermission(
    user: Doc<"users">,
    permission: Permission
): boolean {
    return rolePermissions[user.role].includes(permission);
};