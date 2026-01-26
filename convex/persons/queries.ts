import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";
import { hasRole, getCurrentUser } from "../users/functions";
import { VALID_ROLES } from "../users/permissions";
import { ConvexError, v } from "convex/values";
import { stream } from "convex-helpers/server/stream"; // Import stream
import schema from "../schema";
import { getCounters } from "../counter";
import { ERROR_CODES } from "../helpers/errors";


export const getAllPaginated = query({
    args: {
        paginationOpts: paginationOptsValidator,
        userId: v.optional(v.id("users")),
        name: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { userId, name, paginationOpts } = args;
        const hasName = name && name.trim() !== "";
        const hasUserId = userId !== undefined;
        const queryStream = stream(ctx.db, schema).query("persons");
        let orderedStream;
        if (hasName) {
            if (hasUserId) {
                orderedStream = queryStream.withIndex("index_userId", (x) => x.eq("userId", userId));
            }
            else {
                orderedStream = queryStream.order("desc")
            }

            return await orderedStream.filterWith(async (p) =>
                p.fullname.toLowerCase().includes(name.toLowerCase())
            ).paginate(paginationOpts);
        }

        if (hasUserId) {
            return await ctx.db
                .query("persons")
                .withIndex("index_userId", (q) => q.eq("userId", userId))
                .order("desc")
                .paginate(paginationOpts);
        }

        return await ctx.db
            .query("persons")
            .order("desc")
            .paginate(paginationOpts);
    }
});

export const getPersonsCounter = query({
    args: {},
    handler: async (ctx) => {
        return await getCounters(ctx);
    }
});

export const validateQr = query({
    args: {
        uuid: v.string()
    },
    handler: async (ctx, args) => {
        const person = await ctx.db.query("persons")
            .withIndex("index_qr", q => q.eq("qrCode", args.uuid))
            .unique();

        if (!person) {
            throw new ConvexError(ERROR_CODES.QR_NOT_FOUND);
        }

        return person;
    }
});

export const getQrByDni = query({
    args: {
        dni: v.number()
    },
    handler: async (ctx, args) => {
        const person = await ctx.db.query("persons").withIndex("index_dni", q => q.eq("dni", args.dni)).unique()
        return person?.qrCode
    }
});

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUser(ctx);
        const hasAccess = hasRole(user, VALID_ROLES.RRPP);
        if (!hasAccess) {
            throw new ConvexError(ERROR_CODES.PERMISSIONS_INSUFFICIENT);
        }

        return await ctx.db.query("persons").collect();
    },
});

export const getByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);
        const hasAccess = hasRole(user, VALID_ROLES.RRPP);
        if (!hasAccess) {
            throw new ConvexError(ERROR_CODES.PERMISSIONS_INSUFFICIENT);
        }

        return await ctx.db.query("persons").withIndex("index_userId", (q) => q.eq("userId", args.userId)).collect()
    },
});