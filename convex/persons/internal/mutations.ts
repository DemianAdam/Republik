import { internalMutation } from "../../_generated/server";
import { personValidator } from "../schema";
import { createPersonFunction } from "../functions";
import { backfill, incrementInside, incrementOutside, incrementTotal } from "../counter";
import { ConvexError } from "convex/values";
import { WithoutSystemFields } from "convex/server";
import { Doc, Id } from "../../_generated/dataModel";
import { backfillUser } from "../../users/counter";



export const createPerson = internalMutation({
    args: {
        ...personValidator.omit("isInside").fields
    },
    handler: async (ctx, args) => {
        return await createPersonFunction(ctx, args);
    },
});

export const createTestPersons = internalMutation({
    args: {},
    handler: async (ctx) => {
        const user = await ctx.db.query("users").unique();
        if (!user) {
            throw new ConvexError("this mutation needs a user in the database");
        }

        for (const person of TEST_PERSONS) {
            const insert: WithoutSystemFields<Doc<"persons">> = {
                ...person,
                userId: user._id,
            };

            await ctx.db.insert("persons", insert);

            await incrementTotal(ctx);
            if (person.isInside) {
                await incrementInside(ctx)
            } else {
                await incrementOutside(ctx);
            }
        }

        return { created: TEST_PERSONS.length };
    },
});


export const backfillPersonsCounter = internalMutation({
    args: {},
    handler: async (ctx) => {
        const persons = await ctx.db.query("persons").collect();
        let total = 0;
        let inside = 0;
        let outside = 0;

        const perUser: Record<Id<"users">, { total: number; inside: number; outside: number }> = {}

        for (const p of persons) {
            total++;
            if (p.isInside) {
                inside++;
            } else {
                outside++;
            }

            if (!p.userId) {
                continue;
            }

            if (!perUser[p.userId]) {
                perUser[p.userId] = { total: 0, inside: 0, outside: 0 };
            }

            perUser[p.userId].total++;
            if (p.isInside) {
                perUser[p.userId].inside++;
            }
            else {
                perUser[p.userId].outside++;
            }
        }

        await backfill(ctx, total, inside, outside);
        console.log(perUser);

        for (const [id, { total, inside, outside }] of Object.entries(perUser)) {
            const userId = id as Id<"users">;
            console.log(userId);
            console.log(total, inside, outside);


            await backfillUser(ctx, total, inside, outside, userId);
        }
    }
});

function randomBool() {
    return Math.random() < 0.5;
}

function randomName() {
    const names = [
        "Juan Pérez",
        "María Gómez",
        "Lucas Fernández",
        "Ana López",
        "Sofía Martínez",
        "Nicolás Torres",
        "Valentina Ruiz",
        "Mateo Álvarez",
    ];
    return names[Math.floor(Math.random() * names.length)];
}
function randomDNI() {
    return Math.floor(10_000_000 + Math.random() * 90_000_000);
}

export const TEST_PERSONS: Omit<
    WithoutSystemFields<Doc<"persons">>,
    "userId"
>[] = Array.from({ length: 100 }, (_, i) => ({
    fullname: randomName(),
    isVip: randomBool(),
    isInside: randomBool(),
    qrCode: `qrCode${i}`,
    dni: randomDNI()
}));