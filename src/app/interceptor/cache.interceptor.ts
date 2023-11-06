import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../service/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: CacheService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('login') || request.url.includes('register') || request.url.includes('reset-password') || request.url.includes('refresh') || request.url.includes('verify')) {
      return next.handle(request);
    }
    if(request.method !== 'GET' || request.url.includes('download')) {
      this.cacheService.evictCache();
      return next.handle(request);
    }
    const cachedResponse: HttpResponse<any> = this.cacheService.get(request.url);
    if(cachedResponse) {
      console.log('Found cache: ', cachedResponse);
      return of(cachedResponse);
    }
    return this.handleCache(request, next);
  }

  private handleCache(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(
      tap(response => {
        if(response instanceof HttpResponse && request.method !== 'DELETE') {
          console.log('Caching Response', response);
          this.cacheService.put(request.url, response);
        }
      })
    )
  }
}



