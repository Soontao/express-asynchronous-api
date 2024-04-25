import { equal } from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";
import { pollRequest, queueRequest } from "../src/async_request_queue.mjs";
import storage from "../src/storage.mjs";

describe("express async simple tests", () => {
  beforeEach(() => {
    storage.lpop = mock.fn(() => null);
    storage.rpush = mock.fn();
  });
  it("should support poll request", async () => {
    await pollRequest();
    equal(storage.lpop.mock.callCount(), 1);
  });

  it("should support push request", async () => {
    await queueRequest({});
    equal(storage.rpush.mock.callCount(), 1);
  });
});
