import { defineTable } from "convex/server";
import { v } from "convex/values";

export const personValidator = v.object({
    fullname: v.string(),
    userId: v.optional(v.id("users")),
    isInside: v.boolean(),
    isVip: v.boolean(),
    qrCode: v.string(),
    dni: v.number()
});

export const schema = defineTable(personValidator)
    .index("index_userId", ["userId"])
    .index("index_qr", ["qrCode"])
    .index("index_dni", ["dni"])
