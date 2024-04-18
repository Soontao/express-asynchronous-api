import { raw, Router } from "express";
import {
  createAsyncResponseApi,
  createAsyncScheduleMiddleware,
} from "./middlewares.mjs";
import { createAsyncRequestRunner } from "./runner.mjs";
/**
 * @typedef AsyncAPIOptions
 * @type {{target:string,logger:Console,taskInterval:number,responseEndpoint?:string}}
 */

/**
 * @type {Partial<AsyncAPIOptions>}
 */
const DEFAULT_OPTIONS = {
  taskInterval: 100,
  logger: console,
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
  const router = Router();

  router.get(
    options.responseEndpoint + ":requestId",
    createAsyncResponseApi(options),
  );

  router.use(
    raw({ type: "*/*", limit: "3mb" }),
    createAsyncScheduleMiddleware(options),
  );

  createAsyncRequestRunner(options);

  return router;
}
