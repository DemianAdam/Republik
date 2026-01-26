import { Infer } from "convex/values";
import { errorlogValidator } from "./schema";
import { MutationCtx } from "../_generated/server";

export async function createLogFunction(ctx: MutationCtx, log: Infer<typeof errorlogValidator>) {
    return await ctx.db.insert("errorLogs", log)
}