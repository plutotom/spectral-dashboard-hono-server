import { Context, Hono } from "hono";
import { env } from "hono/adapter";
const { Client } = require("@notionhq/client");

import {
  notionUsersList,
  notionDatabaseTodos,
} from "./notion/notionController";

const notionServer = new Hono();

notionServer.get("/users", notionUsersList);
notionServer.get("/dashboard-todos", notionDatabaseTodos);

export default notionServer;
