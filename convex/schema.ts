import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { schema as userSchema } from "./users/schema";
import { schema as personsSchema, configSchema as personsConfigSchema} from "./persons/schema";
import { schema as logsChema } from "./errorLogs/schema";
import { schema as vipCodesSchema } from "./vipCodes/schema";

const schema = defineSchema({
  ...authTables,
  // other schemas
  users: userSchema,
  persons: personsSchema,
  errorLogs: logsChema,
  vipCodes: vipCodesSchema,
  configs: personsConfigSchema,
  authAccounts: authTables.authAccounts.index('userId', ['userId']),
  authVerifiers: authTables.authVerifiers.index('sessionId', ['sessionId']),
});

export default schema;