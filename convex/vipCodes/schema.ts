import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vipCodeValidator = v.object({
    userId: v.id("users"),
    code: v.string()
});

export const schema = defineTable(vipCodeValidator)
    .index("index_code", ["code"])
    .index("index_userId", ["userId"]);