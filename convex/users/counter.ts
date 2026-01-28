import { ShardedCounter } from "@convex-dev/sharded-counter";
import { Id } from "../_generated/dataModel";
import { components } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";
const totalKey = (userId: Id<"users">) => `${userId}|total`;
const insideKey = (userId: Id<"users">) => `${userId}|inside`;
const outsideKey = (userId: Id<"users">) => `${userId}|outside`;
const personsPerUser = new ShardedCounter<string>(components.shardedCounter, {
    defaultShards: 4
});

export async function incrementUserTotal(ctx: MutationCtx, userId: Id<"users">) {
    await personsPerUser.inc(ctx, totalKey(userId))
}

export async function decremenUserTotal(ctx: MutationCtx, userId: Id<"users">) {
    await personsPerUser.dec(ctx, totalKey(userId))
}

export async function incrementUserInside(ctx: MutationCtx, userId: Id<"users">) {
    await personsPerUser.inc(ctx, insideKey(userId))
}

export async function decrementUserInside(ctx: MutationCtx, userId: Id<"users">) {
    await personsPerUser.dec(ctx, insideKey(userId))
}

export async function incrementUserOutside(ctx: MutationCtx, userId: Id<"users">) {
    await personsPerUser.inc(ctx, outsideKey(userId))
}

export async function decrementUserOutside(ctx: MutationCtx, userId: Id<"users">) {
    await personsPerUser.dec(ctx, outsideKey(userId))
}

export async function getUserCounters(ctx: QueryCtx, userId: Id<"users">) {
    const [total, inside, outside] = await Promise.all([
        personsPerUser.count(ctx, totalKey(userId)),
        personsPerUser.count(ctx, insideKey(userId)),
        personsPerUser.count(ctx, outsideKey(userId))
    ]);

    return { total, inside, outside }
}


export async function backfillUser(ctx: MutationCtx, total: number, inside: number, outside: number, userId: Id<"users">) {
    const keyTotal = totalKey(userId);
    const keyInside = insideKey(userId);
    const keyOutside = outsideKey(userId);

    await personsPerUser.reset(ctx, keyTotal);
    await personsPerUser.reset(ctx, keyInside);
    await personsPerUser.reset(ctx, keyOutside);

    await personsPerUser.add(ctx, keyTotal, total);
    await personsPerUser.add(ctx, keyInside, inside);
    await personsPerUser.add(ctx, keyOutside, outside);
}





