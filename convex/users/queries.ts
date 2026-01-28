import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";
import { getCurrentUser as getUser, isAdmin } from "./functions";
import { userValidator } from "./schema";
import { partial } from "convex-helpers/validators";
import { ConvexError, v } from "convex/values";
import { ERROR_CODES } from "../helpers/errors";
import { getUserCounters } from "./counter";
import { StatisticsInfo, StatisticsResult } from "./types";

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        return await getUser(ctx);
    }
});

export const getUserIdByUserName = query({
    args: {
        userName: v.string()
    },
    handler: async (ctx, args) => {
        if (args.userName.trim() === "") {
            throw new ConvexError(ERROR_CODES.USER_NOT_FOUND);
        }

        const user = await ctx.db.query("users").withIndex("index_userName", q => q.eq("userName", args.userName)).unique();

        if (!user) {
            throw new ConvexError(ERROR_CODES.USER_NOT_FOUND);
        }

        return user;
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

export const getStatistics = query({
    args: {},
    handler: async (ctx): Promise<StatisticsResult> => {
        const user = await getUser(ctx);

        if (isAdmin(user)) {
            const users = await ctx.db.query("users").withIndex("index_role").collect();

            const info = await Promise.all(
                users.map(async (u): Promise<StatisticsInfo> => {
                    const counters = await getUserCounters(ctx, u._id);
                    return {
                        user: u,
                        statistics: {
                            totalPersons: counters.total,
                            insidePersons: counters.inside,
                            outsidePersons: counters.outside
                        }
                    };
                })
            );

            return { info };
        }

        const counters = await getUserCounters(ctx, user._id);

        return {
            info: [{
                user,
                statistics: {
                    totalPersons: counters.total,
                    insidePersons: counters.inside,
                    outsidePersons: counters.outside
                }
            }]
        };
    }
});


export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect()
    }
})

export const getUserByEmail = query({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("users").withIndex("index_email", q => q.eq("email", args.email)).unique()
    }
})