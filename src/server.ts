import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { routes } from "./routes.ts";

const app = new Hono();

app.use("*", async (c, next) => {
  c.header("Content-Type", "text/html; charset=utf-8");
  await next();
});

app.route("/", routes);

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("http://localhost:3000");