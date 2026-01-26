import { defineTable } from "convex/server";
import { VALID_ROLES } from "./permissions";
import { v } from "convex/values";

const roleValidator = () => {
    const union = v.union(...Object.values(VALID_ROLES).map((role) => v.literal(role)));
    return union;
}

export const userValidator = v.object({
    email: v.string(),
    role: roleValidator(),
    name: v.string()
});


export const schema = defineTable(userValidator).index("index_email", ["email"]);

