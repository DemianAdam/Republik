import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { deleteUserData, getCurrentUser, requirePermission } from "./functions";
import { userValidator } from "./schema";
import { Doc } from "../_generated/dataModel";
import { partial } from "convex-helpers/validators";
import { createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { WithoutSystemFields } from "convex/server";
import { PERMISSIONS } from "./permissions";

export const createUser = mutation({
    args: {
        ...userValidator.fields,
        password: v.string(),
    },
    /* eslint-disable */
    handler: async (ctx: any, args) => {
        /* eslint-enable */
        const currentUser = await getCurrentUser(ctx);
        requirePermission(currentUser, PERMISSIONS.MANAGE_USERS)

        const newUser = await createAccount(ctx, {
            provider: "password",
            account: {
                id: args.email,
                secret: args.password,
            },
            profile: {
                email: args.email,
                role: args.role,
                name: args.name
            },
            shouldLinkViaEmail: false,
            shouldLinkViaPhone: false,
        });

        return newUser;
    }
});

export const deleteUser = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const currentUser = await getCurrentUser(ctx);
        requirePermission(currentUser, PERMISSIONS.MANAGE_USERS)
        if (currentUser._id === args.userId) {
            throw new ConvexError("It cannot delete itself");
        }

        await deleteUserData(ctx, args.userId);
    }
});

export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        ...partial(userValidator.fields),
        password: v.optional(v.string()),
    },

    handler: async (ctx, args) => {
        const currentUser = await getCurrentUser(ctx);
        requirePermission(currentUser,PERMISSIONS.MANAGE_USERS)

        const user = await ctx.db.get("users", args.userId);
        if (!user) {
            throw new ConvexError("User not found");
        }

        const patch: Partial<WithoutSystemFields<Doc<"users">>> = {}

        if (args.password !== undefined && args.password !== "") {
            /* eslint-disable */
            await modifyAccountCredentials(ctx as any, {
                /* eslint-enable */
                provider: "password",
                account: {
                    id: user.email,
                    secret: args.password
                }
            });
        }


        if (args.email !== undefined) {
            const passwordAccount = await ctx.db.query("authAccounts").withIndex("userIdAndProvider", (q) => q.eq("userId", user._id).eq("provider", "password")).unique()
            if (!passwordAccount) {
                throw new ConvexError("There is no Account for this user.");
            }
            passwordAccount.providerAccountId = args.email;
            await ctx.db.patch("authAccounts", passwordAccount._id, passwordAccount);
            patch.email = args.email;
        }
        if (args.role !== undefined) {
            patch.role = args.role
        }

        if (args.name !== undefined) {
            patch.name = args.name
        }

        if (Object.keys(patch).length === 0) {
            return;
        }
        await ctx.db.patch("users", args.userId, patch)
    }
});