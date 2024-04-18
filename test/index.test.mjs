import { equal } from "node:assert";
import { describe, it, mock } from "node:test";
import { createAsyncApiMiddleware } from "../src/index.mjs";

describe("express async simple tests", () => {
  mock.timers.enable({ apis: ["setInterval"] });
  it("should support create new middleware", () => {
    equal(typeof createAsyncApiMiddleware({}), "function");
  });
});
