import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getCurrentUser, requireRole } from "../users/functions";
import { VALID_ROLES } from "../users/permissions";

export const createVipCodes = mutation({
    args: {
        quantity: v.number()
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);
        requireRole(user, VALID_ROLES.RRPP)

        for (let i = 0; i < args.quantity; i++) {
            await ctx.db.insert("vipCodes", { userId: user._id, code: crypto.randomUUID() })
        }
    }
});