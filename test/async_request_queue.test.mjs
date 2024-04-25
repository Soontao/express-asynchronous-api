import { equal } from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";
import {
  fetchRequestResponse,
  pollRequest,
  queueRequest,
  saveRequestResponse,
} from "../src/async_request_queue.mjs";
import { createStorage } from "../src/storage.mjs";

describe("express async simple tests", () => {
  const storage = createStorage({ storageType: "mock" });

  beforeEach(() => {
    storage.lpop = mock.fn(() => null);
    storage.rpush = mock.fn();
    storage.get = mock.fn(() => null);
  });
  it("should support poll request", async () => {
    await pollRequest(storage);
    equal(storage.lpop.mock.callCount(), 1);
  });

  it("should support push request", async () => {
    await queueRequest(storage, {});
    equal(storage.rpush.mock.callCount(), 1);
  });

  it("should fetchRequestResponse", async () => {
    storage.lpop.mock.mockImplementationOnce(() => ({}));
    storage.get.mock.mockImplementationOnce(() => JSON.stringify({}));
    await fetchRequestResponse(storage, "id");
  });

  it("should fetchRequestResponse when no request", async () => {
    storage.lpop.mock.mockImplementationOnce(() => ({}));
    storage.get.mock.mockImplementationOnce(() => null);
    await fetchRequestResponse(storage, "id");
  });

  it("should saveRequestResponse", async () => {
    await saveRequestResponse(storage, "id", 200, {}, undefined);
  });
});
