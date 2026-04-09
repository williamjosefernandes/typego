export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequest {
  method: HttpMethod;
  path: string;
  body?: unknown;
}

export interface HttpResponse {
  status(code: number): HttpResponse;
  json(payload: unknown): void;
  send(payload: string): void;
}

export type HttpHandler = (req: HttpRequest, res: HttpResponse) => void | Promise<void>;

