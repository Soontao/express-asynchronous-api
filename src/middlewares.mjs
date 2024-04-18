import { fetchRequestResponse, queueRequest } from "./async_request_queue.mjs";

/**
 * @type {import("express").RequestHandler}
 */
export async function asyncResponseApi(req, res) {
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
}

/**
 * @type {import("express").RequestHandler}
 */
export async function asyncScheduleMiddleware(req, res) {
  const requestId = await queueRequest(req);
  // accepted
  res.status(202).json({ requestId });
}
