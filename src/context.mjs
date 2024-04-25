export class AsyncRequestMiddlewareContext {
  /**
   *
   * @param {import("./index.mjs").AsyncAPIOptions} options
   * @param {import("./storage.mjs").Storage} storage
   */
  constructor(options, storage) {
    this.options = options;
    this.storage = storage;
  }
}
