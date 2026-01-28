import { convexAuth, createAccount, GenericActionCtxWithAuthConfig, retrieveAccount } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";
import { Role, VALID_ROLES } from "./users/permissions";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { ConvexError, Infer, Value } from "convex/values";
import { ERROR_CODES } from "./helpers/errors";
import { Scrypt } from "lucia";
import { userValidator } from "./users/schema";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ConvexCredentials<DataModel>({
      id: "password",
      crypto: {
        async hashSecret(password: string) {
          return await new Scrypt().hash(password);

        },
        async verifySecret(password: string, hash: string) {
          return await new Scrypt().verify(hash, password);
        },
      },
      authorize: async (credentials, ctx) => {
        const flow = credentials.flow as string | undefined;
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        console.log(flow);

        if (!email || !password) {
          throw new Error("Email, password and name are required");
        }

        const requiredAccount = {
          email,
          password
        }

        if (flow === "signUp") {
          const name = credentials.name as string | undefined;
          if (!name) {
            throw new Error("Name is required for sign up")
          }
          const role = credentials.role as Role | undefined;
          if (!role) {
            throw new Error("Role is required for sign up");
          }
          const requiredProfile = {
            email: requiredAccount.email,
            role,
            name
          }

          return await signUpflow(credentials, ctx, requiredProfile, password);
        }

        return await signInFlow(ctx, requiredAccount);
      }
    })
  ]
});

async function signInFlow(ctx: GenericActionCtxWithAuthConfig<DataModel>, requiredAccount: { email: string, password: string }) {
  const existing = await retrieveAccount(ctx, {
    provider: "password",
    account: {
      id: requiredAccount.email,
      secret: requiredAccount.password, // verified via crypto.verifySecret
    },
  });


  if (!existing) {
    throw new ConvexError(ERROR_CODES.AUTH_USER_NOT_FOUND);
  }

  return { userId: existing.user._id };
}

async function signUpflow(credentials: Partial<Record<string, Value | undefined>>, ctx: GenericActionCtxWithAuthConfig<DataModel>, requiredProfile: Infer<typeof userValidator>, password: string) {
  const userName = credentials.userName as string | undefined;
  if (requiredProfile.role === VALID_ROLES.RRPP && !userName) {
    throw new ConvexError("UserName is required for rrpp user");
  }

  requiredProfile.userName = userName;


  const account = await createAccount(ctx, {
    provider: "password",
    account: {
      id: requiredProfile.email,
      secret: password, // will be hashed via crypto.hashSecret
    },
    profile: requiredProfile,
    shouldLinkViaEmail: false,
    shouldLinkViaPhone: false,
  });

  return { userId: account.user._id };
}
