import { equal } from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";
import {
  fetchRequestResponse,
  pollRequest,
  queueRequest,
  saveRequestResponse,
} from "../src/async_request_queue.mjs";
import storage from "../src/storage.mjs";

describe("express async simple tests", () => {
  beforeEach(() => {
    storage.lpop = mock.fn(() => null);
    storage.rpush = mock.fn();
    storage.get = mock.fn(() => null);
  });
  it("should support poll request", async () => {
    await pollRequest();
    equal(storage.lpop.mock.callCount(), 1);
  });

  it("should support push request", async () => {
    await queueRequest({});
    equal(storage.rpush.mock.callCount(), 1);
  });

  it("should fetchRequestResponse", async () => {
    storage.lpop.mock.mockImplementationOnce(() => ({}));
    storage.get.mock.mockImplementationOnce(() => JSON.stringify({}));
    await fetchRequestResponse("id");
  });

  it("should fetchRequestResponse when no request", async () => {
    storage.lpop.mock.mockImplementationOnce(() => ({}));
    storage.get.mock.mockImplementationOnce(() => null);
    await fetchRequestResponse("id");
  });

  it("should saveRequestResponse", async () => {
    await saveRequestResponse("id", 200, {}, undefined);
  });
});
