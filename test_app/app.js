import express from "express";
import { createAsyncApiMiddleware } from "../src/index.mjs";

const app = express();

app.use(
  "/async-api",
  createAsyncApiMiddleware({ target: "https://postman-echo.com" }),
);

app.listen(3001);
