import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response, Request } from 'express';
import * as R from 'ramda'
import * as fs from 'fs';

import { HttpExceptionResponse, EndPointError } from './interfaces';


@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string | Array<string>
    let fields = []

    if (exception.source === 'db') {
      errorMessage = exception.name
      fields = exception.fields
      status = HttpStatus.BAD_REQUEST
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage = R.propOr(false, 'message', errorResponse) || (errorResponse as HttpExceptionResponse).error || exception.message
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical internal server error occurred!';
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);

    if (process.env.WRITE_ERROR_LOGS) {
      const errorLog = this.getErrorLog(errorResponse, request, exception);
      this.writeErrorLogToFile(errorLog);
    }

    if (fields) errorResponse.fields = fields

    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string | Array<string>,
    request: Request,
  ): EndPointError => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timestamp: new Date()
  });

  private getErrorLog = (
    errorResponse: EndPointError,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
    ${JSON.stringify(errorResponse)}\n\n
    User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
    ${exception instanceof HttpException ? exception.stack : error}\n\n`;
    return errorLog;
  };

  private writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };
}