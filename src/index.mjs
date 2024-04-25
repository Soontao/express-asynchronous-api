import { raw, Router } from "express";
import { AsyncRequestMiddlewareContext } from "./context.mjs";
import {
  createAsyncResponseApi,
  createAsyncScheduleMiddleware,
} from "./middlewares.mjs";
import { createAsyncRequestRunner } from "./runner.mjs";
import { createStorage } from "./storage.mjs";

/**
 * @typedef AsyncAPIOptions
 * @type {{
 *  target:string,
 *  logger:Console,
 *  taskInterval:number,
 *  responseEndpoint?:string,
 *  storageType?:'mock'|'redis'|'memory',
 *  storageOptions?: any,
 * }}
 */

/**
 * @type {Partial<AsyncAPIOptions>}
 */
const DEFAULT_OPTIONS = {
  taskInterval: 100,
  logger: console,
  storageOptions: "mock",
  responseEndpoint: "/-/responses/",
};

/**
 * create a new async api middleware
 *
 * @param {AsyncAPIOptions} [options]
 * @returns
 */
export function createAsyncApiMiddleware(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  const storage = createStorage(options);
  const context = new AsyncRequestMiddlewareContext(options, storage);
  const router = Router();

  router.get(
    options.responseEndpoint + ":requestId",
    createAsyncResponseApi(context),
  );

  router.use(
    raw({ type: "*/*", limit: "3mb" }),
    createAsyncScheduleMiddleware(context),
  );

  createAsyncRequestRunner(context);

  return router;
}
