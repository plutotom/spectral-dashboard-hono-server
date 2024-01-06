import { Hono } from "hono";
import { handle } from "hono/vercel";
import { env } from "hono/adapter";
const { Client } = require("@notionhq/client");

export const config = {
  runtime: "edge",
  port: 5005,
};

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.get("/notion/users", async (c) => {
  const url = "notion.so/api/notion/users";
  // Initializing a client
  const { NOTION_SECRET } = env<{ NOTION_SECRET: string }>(c);
  const notion = new Client({
    auth: NOTION_SECRET,
  });

  // Getting a user
  const listUsersResponse = await notion.users.list({});
  return c.json(listUsersResponse);
});

app.notFound((c) => {
  return c.text("Custom 404 Message from Isaiah", 404);
});

export default handle(app);
