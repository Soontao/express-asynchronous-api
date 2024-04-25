import * as uuid from "uuid";

const QUEUE = "express_api_request_queue";

function _generateResponseId(requestId) {
  return `express_api_request_response_${requestId}`;
}

export async function fetchRequestResponse(storage, requestId) {
  const result = await storage.get(_generateResponseId(requestId));
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
  storage,
  requestId,
  status,
  headers,
  bodyInBase64,
) {
  await storage.set(
    _generateResponseId(requestId),
    JSON.stringify({ headers, status, bodyInBase64 }),
  );
}

/**
 * poll request from queue
 *
 * @returns
 */
export async function pollRequest(storage) {
  const record = await storage.lpop(QUEUE);
  if (record === null) return;

  const { requestId, url, method, headers, bodyInBase64 } = JSON.parse(record);

  const body = bodyInBase64 ? Buffer.from(bodyInBase64, "base64") : undefined;

  return { requestId, url, method, headers, body };
}

/**
 * @param {Express.Request} request
 * @returns {Promise<string>} queued request id
 */
export async function queueRequest(storage, request) {
  const requestId = uuid.v4();
  const { body, method, headers, url } = request;
  await storage.rpush(
    QUEUE,
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
