import { v } from "convex/values";
import { internalAction, internalMutation } from "../../_generated/server";
import { deleteUserData } from "../functions";
import { signIn } from "../../auth";

export const createAdminUser = internalAction({
    args: {},
    handler: async (ctx) => {
        const args = {
            provider: "password",
            calledBy: "convex/users/internal/mutations.ts->createAdminUser",
            params: {
                flow: "signUp",
                email: "admin@admin.com",
                password: "12345678",
                //my custom field in schema
                role: "admin",
                name: "Administrador Republik"
            }
        }
        // @ts-expect-error accessing Convex internal handler
        //signIn imported from ./auth convexAuth
        await signIn._handler(ctx, args);
    }
});

export const deleteUserInternal = internalMutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await deleteUserData(ctx, args.userId);
    }
});