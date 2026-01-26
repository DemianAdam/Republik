import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";
import { Role, VALID_ROLES } from "./users/permissions";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      id: "password",
      profile(params) {
        if (params.flow === 'signIn') {
          return {
            email: params.email as string,
            role: VALID_ROLES.RRPP,
            name: params.name as string
          }
        }
        return {
          email: params.email as string,
          role: params.role as Role,
          name: params.name as string
        };
      },

    })
  ],
});