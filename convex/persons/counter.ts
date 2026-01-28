import { ShardedCounter } from "@convex-dev/sharded-counter";
import { components } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";

const personCounter = new ShardedCounter(components.shardedCounter, {
    // optional: tune shards if you expect very high write throughput
    defaultShards: 4,
});

const totalKey = "persons.total";
const insideKey = "persons.inside";
const outsideKey = "persons.outside"

export async function incrementTotal(ctx: MutationCtx) {
    await personCounter.inc(ctx, totalKey)
}

export async function decrementTotal(ctx: MutationCtx) {
    await personCounter.dec(ctx, totalKey)
}

export async function incrementInside(ctx: MutationCtx) {
    await personCounter.inc(ctx, insideKey)
}
export async function decrementInside(ctx: MutationCtx) {
    await personCounter.dec(ctx, insideKey)
}

export async function incrementOutside(ctx: MutationCtx) {
    await personCounter.inc(ctx, outsideKey)
}

export async function decrementOutside(ctx: MutationCtx) {
    await personCounter.dec(ctx, outsideKey)
}

export async function getCounters(ctx: QueryCtx) {
    const [total, inside, outside] = await Promise.all([
        personCounter.count(ctx, totalKey),
        personCounter.count(ctx, insideKey),
        personCounter.count(ctx, outsideKey)
    ]);

    return { total, inside, outside }
}

export async function backfill(ctx: MutationCtx, total: number, inside: number, outside: number) {
    await personCounter.reset(ctx, totalKey);
    await personCounter.reset(ctx, insideKey);
    await personCounter.reset(ctx, outsideKey);

    await personCounter.add(ctx, totalKey, total);
    await personCounter.add(ctx, insideKey, inside);
    await personCounter.add(ctx, outsideKey, outside);
}