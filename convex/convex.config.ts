import { defineApp } from "convex/server";
import resend from "@convex-dev/resend/convex.config.js";
import shardedCounter from "@convex-dev/sharded-counter/convex.config.js";

const app = defineApp();
app.use(resend);
app.use(shardedCounter)

export default app;