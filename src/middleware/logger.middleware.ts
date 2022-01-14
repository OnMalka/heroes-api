import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // constructor() { }
  use(req: Request, res: Response, next: NextFunction) {
    const loggerService = new LoggerService(req.url.slice(1).split('/')[0]);
    const tempUrl = req.method + ' ' + req.url.split('?')[0];
    const _headers = JSON.stringify(req.headers ? req.headers : {});
    const _query = JSON.stringify(req.query ? req.query : {});
    const _body = JSON.stringify(req.body ? req.body : {});
    const _url = JSON.stringify(tempUrl ? tempUrl : {});

    loggerService.log(`${_url} request ${_headers} ${_query} ${_body}`.replace(/\\/, ''));

    const { ip } = req;
    const userAgent = req.get('user-agent') || '';
    res.on('close', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      loggerService.log(`${_url} response ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    });
    next();
  }

  // private loggerService = new LoggerService('http');

  // use(request: Request, response: Response, next: NextFunction): void {
  //   const { ip, method, path: url } = request;
  //   const userAgent = request.get('user-agent') || '';

  //   response.on('close', () => {
  //     const { statusCode } = response;
  //     const contentLength = response.get('content-length');

  //     this.loggerService.log(
  //       `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
  //     );
  //   });

  //   next();
  // }
}