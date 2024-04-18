import * as uuid from "uuid";
import storage from "./storage.mjs";

export async function fetchRequestResponse(requestId) {
  const result = await storage.get(`response_${requestId}`);
  if (result === null) {
    return null;
  }
  const { headers, status, bodyInBase64 } = JSON.parse(result);
  const body = bodyInBase64 ? Buffer.from(bodyInBase64, "base64") : undefined;
  return { headers, status, body };
}

/**
 *
 * @param {string} requestId
 */
export async function saveRequestResponse(
  requestId,
  status,
  headers,
  bodyInBase64,
) {
  await storage.set(
    `response_${requestId}`,
    JSON.stringify({ headers, status, bodyInBase64 }),
  );
}

/**
 * poll request from queue
 *
 * @returns
 */
export async function pollRequest() {
  const record = await storage.rpop("request_queue");
  if (record === null) return;

  const { requestId, url, method, headers, bodyInBase64 } = JSON.parse(record);

  const body = bodyInBase64 ? Buffer.from(bodyInBase64, "base64") : undefined;

  return { requestId, url, method, headers, body };
}

/**
 * @param {Express.Request} request
 * @returns {Promise<string>} queued request id
 */
export async function queueRequest(request) {
  const requestId = uuid.v4();
  const { body, method, headers, url } = request;
  await storage.rpush(
    "request_queue",
    JSON.stringify({
      requestId,
      url,
      method,
      headers,
      bodyInBase64: body?.toString?.("base64"),
    }),
  );
  return requestId;
}
