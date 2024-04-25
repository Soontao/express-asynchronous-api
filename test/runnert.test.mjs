import { equal } from "node:assert";
import { before, describe, it, mock } from "node:test";
import { asyncReqRunner } from "../src/runner.mjs";
import { createStorage } from "../src/storage.mjs";

const target = "https://postman-echo.com";

describe("runner test suite", () => {
  const storage = createStorage({ storageType: "mock" });
  before(() => {
    storage.lpop = mock.fn(() => null);
    storage.rpush = mock.fn();
    storage.get = mock.fn(() => null);
    storage.set = mock.fn(() => null);
  });
  it("execute query early return when no record", async () => {
    storage.lpop.mock.mockImplementationOnce(() => null);
    await asyncReqRunner({ storage, options: { target } });
  });

  it("execute query", async () => {
    storage.lpop.mock.mockImplementationOnce(() =>
      JSON.stringify({ url: "/post", method: "POST", headers: {}, body: "" }),
    );
    await asyncReqRunner({ options: { target }, storage });
    equal(storage.set.mock.callCount(), 1);
  });
});
