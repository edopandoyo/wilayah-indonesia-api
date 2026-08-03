import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response, Request } from 'express';

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    if (request.method === 'GET') {
      const url = request.url;

      // Do not cache Swagger docs or OpenAPI JSON
      if (url.includes('/api/docs') || url.includes('/docs-json')) {
        response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        // Cache API responses: 1 day in browser, 30 days in CDN (Cloudflare Edge)
        response.setHeader(
          'Cache-Control',
          'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
        );
      }
    }

    return next.handle();
  }
}
