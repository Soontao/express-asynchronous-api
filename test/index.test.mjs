import { equal } from "node:assert";
import { describe, it } from "node:test";
import { createAsyncApiMiddleware } from "../src/index.mjs";

describe("express async simple tests", () => {
  it("should support create new middleware", () => {
    equal(typeof createAsyncApiMiddleware({}), "function");
  });
});
