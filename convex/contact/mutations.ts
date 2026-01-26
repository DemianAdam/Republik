import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Resend } from "@convex-dev/resend";
export const resend: Resend = new Resend(components.resend, { testMode: false });

export const sendTestEmail = mutation({
    args: {
        name: v.string(),
        lastName: v.string(),
        email: v.string(),
        message: v.string()
    },
    handler: async (ctx, args) => {
        await resend.sendEmail(ctx, {
            from: "onboarding@resend.dev",
            to: 'demianadam05@gmail.com',
            replyTo: [args.email],
            subject: `Contacto: ${args.name} ${args.lastName}`,
            html: `<p>${args.message}</p>`
        });
    }
});