import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";
import { getCurrentUser as getUser } from "./functions";
import { userValidator } from "./schema";
import { partial } from "convex-helpers/validators";

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        return await getUser(ctx);
    }
});

export const getAllPaginated = query({
    args: {
        paginationOpts: paginationOptsValidator,
        ...partial(userValidator.omit("email", "name").fields)
    },
    handler: async (ctx, args) => {
        const { role, paginationOpts } = args;
        const hasRole = role !== undefined;
        const queryTable = ctx.db.query("users");
        if (hasRole) {
            return await queryTable.filter((x) => x.eq(x.field("role"), role)).order("desc").paginate(paginationOpts);
        }

        return await queryTable
            .order("desc")
            .paginate(paginationOpts);

    }
});

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect()
    }
})