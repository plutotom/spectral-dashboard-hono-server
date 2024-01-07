// index.ts
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// Controllers import
import notionServer from "./notionServer";
// import spotifyServer from "./spotifyServer";

const app = new Hono().basePath("/api");
app.notFound((c) => c.json({ error: "Custom 404 Message from Isaiah" }, 404));
export const config = {
  runtime: "edge",
  port: 5004,
};

app.use("*", prettyJSON()); // With options: prettyJSON({ space: 4 })
app.use("*", cors());
export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};
app.use("*", logger(customLogger));

// Routes
app.route("/notion", notionServer);
// app.route("/spotify", spotifyServer);
// app.route("/tickTick", tickTickServer);

// export default app
export default handle(app);
