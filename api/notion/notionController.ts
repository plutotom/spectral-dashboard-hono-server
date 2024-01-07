import { Client, isFullBlock } from "@notionhq/client";
import { env } from "hono/adapter";
import { Context } from "hono";

const notionUsersList = async (c: Context) => {
  console.log("hit /notion/users");
  const url = "notion.so/api/notion/users";
  // Initializing a client
  const { NOTION_SECRET } = env<{ NOTION_SECRET: string }>(c);
  const notion = new Client({
    auth: NOTION_SECRET,
  });

  // Getting a user
  const listUsersResponse = await notion.users.list({});
  return c.json({ users: listUsersResponse, ok: true });
};

const notionDatabaseTodos = async (c: Context) => {
  // Initializing a client
  const { NOTION_SECRET } = env<{ NOTION_SECRET: string }>(c);
  const notion = new Client({
    auth: NOTION_SECRET,
  });

  const page = await notion.pages.retrieve({
    page_id: process.env.NOTION_DASHBOARD_PAGE || "",
  });

  interface Block {
    object: string;
    id: string;
    type: string;
    created_time: string;
    last_edited_time: string;
    has_children: boolean;
    parent: {
      type: string;
      page_id: string;
    };
    properties: {
      title: any[];
    };
  }

  const blockData = await notion.blocks.children.list({
    block_id: page.id,
  });

  let children = blockData.results.filter(
    (block) => (block as Block).has_children
  );
  children = children.map((child: { id: any }) => child.id);

  const childrenData = await Promise.all(
    children.map((child: any) =>
      notion.blocks.children.list({ block_id: child })
    )
  );

  childrenData.forEach((child) => {
    blockData.results = blockData.results.concat(child.results);
  });

  console.log(children);
  return c.json(blockData);
};

export { notionUsersList, notionDatabaseTodos };
