import { IncomingHttpHeaders } from "http";

export type SessionHeaders = {
  authorization?: string;
  cookie?: string;
};

function readSingleHeader(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export function extractSessionHeaders(
  headers?: IncomingHttpHeaders,
): SessionHeaders {
  return {
    authorization: readSingleHeader(headers?.authorization),
    cookie: readSingleHeader(headers?.cookie),
  };
}
