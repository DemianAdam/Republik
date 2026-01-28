import { ConvexError, Infer } from "convex/values";
import { MutationCtx } from "../_generated/server";
import { personValidator } from "./schema";
import { WithoutSystemFields } from "convex/server";
import { Doc } from "../_generated/dataModel";
import { incrementTotal, incrementOutside } from "./counter";
import { ERROR_CODES } from "../helpers/errors";
import { incrementUserOutside, incrementUserTotal } from "../users/counter";


export type CreatedPerson = Omit<Doc<"persons">, "_creationTime">
export const createPersonValidator = personValidator.omit("isInside", "qrCode");
export async function createPersonFunction(ctx: MutationCtx, args: Infer<typeof createPersonValidator>): Promise<CreatedPerson> {
    const insert: WithoutSystemFields<Doc<"persons">> = {
        ...args,
        qrCode: crypto.randomUUID(),
        isInside: false,
    };

    const person = await ctx.db.query("persons").withIndex("index_dni", q => q.eq("dni", args.dni)).unique();
    if (person) {
        throw new ConvexError(ERROR_CODES.PERSON_ALREADY_CREATED);
    }

    const personId = await ctx.db.insert("persons", insert);

    await incrementTotal(ctx);
    await incrementOutside(ctx);
    if (insert.userId) {
        incrementUserTotal(ctx, insert.userId);
        incrementUserOutside(ctx, insert.userId);
    }
    return {
        _id: personId,
        ...insert
    };
}

export function getGuestDataFromQr(qrData: string) {
    const parts = qrData.split("@");
    if (parts.length !== 9) {
        throw new ConvexError(ERROR_CODES.PERSON_INVALID_QR)
    }

    const lastName = parts[1];
    const name = parts[2];
    const dni = parseInt(parts[4]);
    const [day, month, year] = parts[6].split("/").map(x => parseInt(x))
    const birthday = `${year}-${month}-${day}`;

    if (!lastName || !name || !dni || isNaN(dni) || !day || isNaN(day) || !month || isNaN(month) || !year || isNaN(year)) {
        throw new ConvexError(ERROR_CODES.PERSON_INVALID_QR)
    }
    return {
        fullname: `${name} ${lastName}`,
        dni,
        birthday
    }
}

export function getAge(birthday: string) {
    const today = new Date();
    const birth = dateFromDateOnly(birthday);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

function dateFromDateOnly(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}