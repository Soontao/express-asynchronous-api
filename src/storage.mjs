import MockRedis from "ioredis-mock";

const storage = new MockRedis();

export class Storage {}

/**
 *
 * @param {import("./index.mjs").AsyncAPIOptions} options
 */
export function createStorage(options) {
  switch (options?.storageType) {
    case "mock":
    case "memory":
      return new MockRedis();
    default:
      break;
  }
}

export default storage;
