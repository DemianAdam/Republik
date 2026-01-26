import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "../_generated/dataModel";
import { Permission, Role, roleHierarchy, rolePermissions, VALID_ROLES } from "./permissions";
import { MutationCtx, QueryCtx } from "../_generated/server";
import asyncMap from "../helpers/asyncMap";
import { ConvexError } from "convex/values";
import { ERROR_CODES } from "../helpers/errors";

export function requireRole(
  user: Doc<"users">,
  role: Role) {
  if (!hasRole(user, role)) {
    throw new ConvexError(ERROR_CODES.PERMISSIONS_INSUFFICIENT);
  }
}
export function hasRole(
  user: Doc<"users">,
  requiredRole: Role,
): boolean {
  if (!user || !user.role || !(user.role in roleHierarchy)) return false;
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

export function hasPermission(
  user: Doc<"users">,
  permission: Permission
): boolean {

  return rolePermissions[user.role].includes(permission);
};

export function requirePermission(
  user: Doc<"users">,
  permission: Permission) {
  if (!hasPermission(user, permission)) {
    throw new ConvexError(ERROR_CODES.PERMISSIONS_INSUFFICIENT);
  }
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(ERROR_CODES.AUTH_NOT_SIGNED_IN);
  }
  const user = await ctx.db.get("users", userId);
  if (!user) {
    throw new ConvexError(ERROR_CODES.AUTH_USER_NOT_FOUND);
  }

  return user;
}

export function isAdmin(
  user: Doc<"users">,
): boolean {
  return hasRole(user, VALID_ROLES.ADMIN);
}

export async function deleteUserData(ctx: MutationCtx, userId: Id<"users">): Promise<void> {
  const [authSessions, authAccounts] = await Promise.all([
    ctx.db
      .query('authSessions')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .collect(),
    ctx.db
      .query('authAccounts')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .collect(),
  ])
  const [authRefreshTokens, authVerificationCodes, authVerifiers] =
    await Promise.all([
      (
        await asyncMap(authSessions, async (session) => {
          return ctx.db
            .query('authRefreshTokens')
            .withIndex('sessionId', (q) => q.eq('sessionId', session._id))
            .collect()
        })
      ).flat(),
      (
        await asyncMap(authAccounts, async (account) => {
          return ctx.db
            .query('authVerificationCodes')
            .withIndex('accountId', (q) => q.eq('accountId', account._id))
            .collect()
        })
      ).flat(),
      (
        await asyncMap(authSessions, async (session) => {
          return ctx.db
            .query('authVerifiers')
            .withIndex('sessionId', (q) => q.eq('sessionId', session._id))
            .collect()
        })
      ).flat(),
    ])
  await Promise.all([
    asyncMap(authSessions, (session) => ctx.db.delete("authSessions", session._id)),
    asyncMap(authAccounts, (account) => ctx.db.delete("authAccounts", account._id)),
    asyncMap(authRefreshTokens, (token) => ctx.db.delete("authRefreshTokens", token._id)),
    asyncMap(authVerificationCodes, (code) => ctx.db.delete("authVerificationCodes", code._id)),
    asyncMap(authVerifiers, (verifier) => ctx.db.delete("authVerifiers", verifier._id)),
    ctx.db.delete("users", userId),
  ])
}
