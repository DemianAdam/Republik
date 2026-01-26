import { query } from "../_generated/server";
import { getCurrentUser, isAdmin, requireRole } from "../users/functions";
import { VALID_ROLES } from "../users/permissions";

export const getCurrentUserVipCodes = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUser(ctx);
        requireRole(user, VALID_ROLES.RRPP)

        if (isAdmin(user)) {
            return await ctx.db.query("vipCodes").collect();
        }

        return await ctx.db.query("vipCodes").withIndex("index_userId", q => q.eq("userId", user._id)).collect();
    }
});