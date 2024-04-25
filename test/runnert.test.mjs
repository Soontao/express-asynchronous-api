import { equal } from "node:assert";
import { before, describe, it, mock } from "node:test";
import { asyncReqRunner } from "../src/runner.mjs";
import storage from "../src/storage.mjs";

const target = "https://postman-echo.com";

describe("runner test suite", () => {
  before(() => {
    storage.lpop = mock.fn(() => null);
    storage.rpush = mock.fn();
    storage.get = mock.fn(() => null);
    storage.set = mock.fn(() => null);
  });
  it("execute query early return when no record", async () => {
    storage.lpop.mock.mockImplementationOnce(() => undefined);
    await asyncReqRunner({});
  });

  it("execute query", async () => {
    storage.lpop.mock.mockImplementationOnce(() =>
      JSON.stringify({ url: "/post", method: "POST", headers: {}, body: "" }),
    );
    await asyncReqRunner({ target });
    equal(storage.set.mock.callCount(), 1);
  });
});
