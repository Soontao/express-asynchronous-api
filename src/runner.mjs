import { pollRequest, saveRequestResponse } from "./async_request_queue.mjs";

/**
 *
 * @param {import("./index.mjs").AsyncAPIOptions} options
 */
export function createAsyncRequestRunner(options) {
  setInterval(async function _asyncReqRunner() {
    try {
      const request = await pollRequest();
      if (request === undefined) {
        return;
      }

      const response = await fetch([options.target, request.url].join(""), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      const responseAr = await response.arrayBuffer();
      const responseBody =
        responseAr.byteLength > 0
          ? Buffer.from(responseAr).toString("base64")
          : undefined;
      const responseHeaders = Array.from(response.headers.entries());
      await saveRequestResponse(
        request.requestId,
        response.status,
        responseHeaders,
        responseBody,
      );
    } catch (error) {
      options.logger?.error?.("technical error happened", error);
    }
  }, options.taskInterval);
}
