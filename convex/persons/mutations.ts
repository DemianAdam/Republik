import { mutation } from "../_generated/server";
import { getCurrentUser, isAdmin, requirePermission } from "../users/functions";
import { PERMISSIONS } from "../users/permissions";
import { ConvexError, Infer, v } from "convex/values";
import { personValidator } from "./schema";
import { Doc } from "../_generated/dataModel";
import { WithoutSystemFields } from "convex/server";
import { createPersonFunction, createPersonValidator, getAge, getConfig, getGuestDataFromQr, validateConfig } from "./functions";
import { decrementInside, decrementOutside, decrementTotal, getCounters, incrementInside, incrementOutside } from "./counter";
import { ERROR_CODES } from "../helpers/errors";
import { createLogFunction } from "../errorLogs/functions";

export const createPerson = mutation({
    args: personValidator.omit("isInside", "userId", "qrCode"),

    handler: async (ctx, args) => {
        await validateConfig(ctx);
        const user = await getCurrentUser(ctx);
        requirePermission(user, PERMISSIONS.CREATE_PERSON)

        const argsObj: Infer<typeof createPersonValidator> = {
            userId: user._id,
            ...args
        }

        return await createPersonFunction(ctx, argsObj);
    },
});

export const createQrPerson = mutation({
    args: {
        qrData: v.string(),
        /* TODO: vip code Implementation
        vipCode: v.optional(v.string()), 
        */
        userId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        await validateConfig(ctx);
        let person;
        try {
            person = getGuestDataFromQr(args.qrData);
        } catch (err) {
            if (err instanceof ConvexError) {
                await createLogFunction(ctx, { errorCode: err.data, stackTrace: err.stack })
            }
            else if (err instanceof Error) {
                const error = new ConvexError(ERROR_CODES.UNKNOWN_ERROR);
                await createLogFunction(ctx, { errorCode: error.data, stackTrace: err.stack })
                throw error;
            }
            else {
                const error = new ConvexError(ERROR_CODES.UNKNOWN_ERROR);
                await createLogFunction(ctx, { errorCode: error.data, stackTrace: error.stack })
                throw error;
            }
            throw err;
        }

        if (getAge(person.birthday) < 18) {
            throw new ConvexError(ERROR_CODES.PERSON_UNDER_AGE)
        }

        const isVip: boolean = false;
        /*
        TODO: Vip code implementation
        let userId: Id<"users"> | undefined
        if (args.vipCode !== undefined) {
            const code = args.vipCode;
            const vipCode = await ctx.db.query("vipCodes").withIndex("index_code", q => q.eq("code", code)).unique()
            if (!vipCode) {
                throw new ConvexError(ERROR_CODES.PERSON_VIP_CODE_NOT_FOUND)
            }
            isVip = true;
            userId = vipCode.userId;
            await ctx.db.delete("vipCodes", vipCode._id);
        }*/

        const argsObj: Infer<typeof createPersonValidator> = {
            fullname: person.fullname,
            dni: person.dni,
            isVip,
            userId: args.userId
        }

        return await createPersonFunction(ctx, argsObj);
    }
});

export const deletePerson = mutation({
    args: {
        personId: v.id("persons"),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);
        requirePermission(user, PERMISSIONS.DELETE_PERSON)

        const person = await ctx.db.get("persons", args.personId);
        if (!person) {
            throw new ConvexError(ERROR_CODES.PERSON_NOT_FOUND);
        }

        if (!isAdmin(user) && person.userId !== user._id) {
            throw new ConvexError(ERROR_CODES.PERSON_DELETE_NOT_ALLOWED);
        }

        await ctx.db.delete("persons", args.personId);

        await decrementTotal(ctx);
        if (person.isInside) {
            await decrementInside(ctx);
        }
        else {
            await decrementOutside(ctx);
        }
    },
});

export const updatePerson = mutation({
    args: {
        personId: v.id("persons"),
        ...personValidator.omit("isInside", "userId", "qrCode").fields
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);
        requirePermission(user, PERMISSIONS.UPDATE_PERSON)

        const person = await ctx.db.get("persons", args.personId);
        if (!person) {
            throw new ConvexError(ERROR_CODES.PERSON_NOT_FOUND);
        }
        if (!isAdmin(user) && person.userId !== user._id) {
            throw new ConvexError(ERROR_CODES.PERSON_UPDATE_NOT_ALLOWED);
        }

        const patch: Omit<WithoutSystemFields<Doc<"persons">>, "userId" | "isInside" | "qrCode"> = {
            fullname: args.fullname,
            isVip: args.isVip,
            dni: args.dni
        }

        await ctx.db.patch("persons", args.personId, patch);
    }
});

export const deleteList = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUser(ctx);
        requirePermission(user, PERMISSIONS.DELETE_PERSON)

        const persons = await ctx.db.query("persons").collect()

        await Promise.all(persons.map(p => {
            ctx.db.delete("persons", p._id)
            decrementTotal(ctx);
            if (p.isInside) {
                decrementInside(ctx);
            }
            else {
                decrementOutside(ctx);
            }
        }))
    }
});

export const validatePerson = mutation({
    args: {
        qrData: v.string()
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);
        requirePermission(user, PERMISSIONS.SETINSIDE_PERSON);

        const person = await ctx.db.query("persons").withIndex("index_qr", q => q.eq("qrCode", args.qrData)).unique();
        if (!person) {
            throw new ConvexError(ERROR_CODES.PERSON_NOT_FOUND);
        }

        if (person.isInside) {
            throw new ConvexError(ERROR_CODES.PERSON_ALREADY_INSIDE);
        }

        await ctx.db.patch("persons", person._id, { isInside: true });
        await incrementInside(ctx)
        await decrementOutside(ctx);

        return { ...person, isInside: true };
    }
});

export const setIsInside = mutation({
    args: {
        personId: v.id("persons"),
        isInside: v.boolean()
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);
        requirePermission(user, PERMISSIONS.SETINSIDE_PERSON)
        const person = await ctx.db.get("persons", args.personId);
        if (!person) {
            throw new ConvexError(ERROR_CODES.PERSON_NOT_FOUND);
        }

        if (person.isInside === args.isInside) {
            return person;
        }

        await ctx.db.patch("persons", args.personId, {
            isInside: args.isInside
        });

        if (args.isInside) {
            await incrementInside(ctx)
            await decrementOutside(ctx);
        } else {
            await decrementInside(ctx)
            await incrementOutside(ctx)
        }
    }
});