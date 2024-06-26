/* eslint-disable no-unused-vars */
import { fetchRequestResponse, queueRequest } from "./async_request_queue.mjs";
import { AsyncRequestMiddlewareContext } from "./context.mjs";

/**
 *
 * @param {AsyncRequestMiddlewareContext} context
 * @returns
 */
export function createAsyncResponseApi(context) {
  const { options } = context;
  /**
   * @type {import("express").RequestHandler}
   */
  return async function asyncResponseApi(req, res) {
    try {
      const { requestId } = req.params;
      const asyncResponse = await fetchRequestResponse(requestId);
      if (asyncResponse === null) {
        return res.status(404).json({ message: "response is still not ready" });
      }

      res.status(asyncResponse.status);
      for (const [key, val] of asyncResponse.headers) {
        res.setHeader(key, val);
      }
      if (asyncResponse.body) {
        res.send(asyncResponse.body);
      }
      res.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

/**
 *
 * @param {AsyncRequestMiddlewareContext} context
 */
export function createAsyncScheduleMiddleware(context) {
  const { options } = context;
  /**
   * @type {import("express").RequestHandler}
   */
  return async function asyncScheduleMiddleware(req, res) {
    const requestId = await queueRequest(req);
    res.status(202).json({
      requestId,
      responseUrl: `${options.responseEndpoint}${requestId}`,
    });
  };
}
