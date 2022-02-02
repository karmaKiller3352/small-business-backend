export interface HttpExceptionResponse {
  statusCode: number;
  error: string | Array<string>;
}

export interface EndPointError extends HttpExceptionResponse {
  path: string
  method: string
  timestamp: Date
  fields?: Array<string>
}