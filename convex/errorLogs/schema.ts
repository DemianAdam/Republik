import { v } from "convex/values";
import { ERRORS } from "../helpers/errors";
import { defineTable } from "convex/server";

export const errorlogValidator = v.object({
    errorCode: v.union(...ERRORS.map(e => v.literal(e))),
    stackTrace: v.optional(v.string())
});

export const schema = defineTable(errorlogValidator);