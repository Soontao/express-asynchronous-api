import { raw, Router } from "express";
import { asyncResponseApi, asyncScheduleMiddleware } from "./middlewares.mjs";
import { createAsyncRequestRunner } from "./runner.mjs";
/**
 * @typedef AsyncAPIOptions
 * @type {{target:string,logger:Console,taskInterval:number}}
 */

/**
 * @type {Partial<AsyncAPIOptions>}
 */
const DEFAULT_OPTIONS = {
  taskInterval: 100,
  logger: console,
};

/**
 * create a new async api middleware
 *
 * @param {AsyncAPIOptions} [options]
 * @returns
 */
export function createAsyncApiMiddleware(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  const router = Router();

  router.get("/-/responses/:requestId", asyncResponseApi);

  router.use(raw({ type: "*/*", limit: "3mb" }), asyncScheduleMiddleware);

  createAsyncRequestRunner(options);

  return router;
}
