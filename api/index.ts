import { Hono } from "hono";
import { handle } from "hono/vercel";
import { env } from "hono/adapter";
const { Client } = require("@notionhq/client");
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";

export const config = {
  runtime: "edge",
  port: 5005,
};

const app = new Hono().basePath("/api");
app.use("*", prettyJSON()); // With options: prettyJSON({ space: 4 })
app.use("*", cors());

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
  // return plain json
  c.header("Content-Type", "application/json");
  return c.json({ users: listUsersResponse, ok: true });
});

// api.post('/posts', async (c) => {
//   const param = await c.req.json()
//   const newPost = await model.createPost(c.env.BLOG_EXAMPLE, param as model.Param)
//   if (!newPost) {
//     return c.json({ error: 'Can not create new post', ok: false }, 422)
//   }
//   return c.json({ post: newPost, ok: true }, 201)
// })

app.notFound((c) => {
  return c.text("Custom 404 Message from Isaiah", 404);
});

export default handle(app);
