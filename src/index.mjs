import { raw, Router } from "express";
import * as uuid from "uuid";
import { createAsyncRequestRunner } from "./runner.mjs";
import storage from "./storage.mjs";
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
 * @type {import("express").RequestHandler}
 */
async function _asyncCheckApi(req, res) {
  try {
    const { requestId } = req.params;
    const result = await storage.get(`response_${requestId}`);
    if (result === null) {
      return res.status(404).json({ message: "response is still not ready" });
    }
    const response = JSON.parse(result);
    res.status(response.status);
    for (const [key, val] of response.headers) {
      res.setHeader(key, val);
    }
    res.send(Buffer.from(response.body, "base64")).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * @type {import("express").RequestHandler}
 */
function _asyncApi(req, res) {
  const requestId = uuid.v4();
  const { body, method, headers, url } = req;
  storage.rpush(
    "request_queue",
    JSON.stringify({
      requestId,
      url,
      method,
      headers,
      rawBodyInBase64: body?.toString?.("base64"),
    }),
  );
  // accepted
  res.status(202).json({ requestId });
}
/**
 * create a new async api middleware
 *
 * @param {AsyncAPIOptions} [options]
 * @returns
 */
export function createAsyncApiMiddleware(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  const router = Router();

  router.get("/-/responses/:requestId", _asyncCheckApi);

  router.use(raw({ type: "*/*" }), _asyncApi);

  createAsyncRequestRunner(options);

  return router;
}
