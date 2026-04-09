import type { IncomingHttpHeaders, IncomingMessage } from "node:http";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequest {
  method: HttpMethod;
  path: string;
  query: URLSearchParams;
  headers: IncomingHttpHeaders;
  body?: unknown;
  raw: IncomingMessage;
}

export interface HttpResponse {
  readonly sent: boolean;
  status(code: number): HttpResponse;
  setHeader(name: string, value: string): HttpResponse;
  json(payload: unknown): void;
  send(payload: string): void;
}

export type HttpHandler = (req: HttpRequest, res: HttpResponse) => void | Promise<void>;
export type NextFunction = () => Promise<void>;
export type Middleware = (req: HttpRequest, res: HttpResponse, next: NextFunction) => void | Promise<void>;

