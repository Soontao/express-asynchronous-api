import { pollRequest, saveRequestResponse } from "./async_request_queue.mjs";

/**
 * @private
 * @param {import("./context.mjs").AsyncRequestMiddlewareContext} context
 * @returns
 */
export async function asyncReqRunner(context) {
  const { options, storage } = context;
  try {
    const request = await pollRequest(storage);
    if (request === undefined) {
      return;
    }
    const url = [options.target, request.url].join("");

    try {
      const response = await fetch(url, {
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
        storage,
        request.requestId,
        response.status,
        responseHeaders,
        responseBody,
      );
    } catch (error) {
      options.logger?.error?.("error while reading response", error);
      const errorPayload = JSON.stringify({ error: error.message });
      await saveRequestResponse(
        storage,
        request.requestId,
        500, // internal server error
        [["Content-Type", "application/json"]],
        Buffer.from(errorPayload).toString("base64"),
      );
    }
  } catch (error) {
    options.logger?.error?.("technical error happened while poll queue", error);
  }
}
/**
 *
 * @param {import("./context.mjs").AsyncRequestMiddlewareContext} context
 */
export function createAsyncRequestRunner(context) {
  setInterval(() => asyncReqRunner(context), context.options.taskInterval);
}
