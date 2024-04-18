import storage from "./storage.mjs";

/**
 *
 * @param {import("./index.mjs").AsyncAPIOptions} options
 */
export function createAsyncRequestRunner(options) {
  setInterval(async function _asyncReqRunner() {
    try {
      const record = await storage.rpop("request_queue");
      if (record === null) return;
      const { requestId, url, method, headers, rawBodyInBase64 } =
        JSON.parse(record);
      const body = rawBodyInBase64
        ? Buffer.from(rawBodyInBase64, "base64")
        : undefined;
      const response = await fetch([options.target, url].join(""), {
        method,
        headers,
        body,
      });
      const responseAr = await response.arrayBuffer();
      const responseBodyInBase64 = Buffer.from(responseAr).toString("base64");

      await storage.set(
        `response_${requestId}`,
        JSON.stringify({
          headers: Array.from(response.headers.entries()),
          status: response.status,
          body: responseBodyInBase64,
        }),
      );
    } catch (error) {
      options.logger?.error?.("technical error happened", error);
    }
  }, options.taskInterval);
}
