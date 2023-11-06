import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
    private httpResponseCache: { [key: string]: HttpResponse<any> } = {};

    put = (key: string, httpResponse: HttpResponse<any>): void => {
        console.log(httpResponse);
        this.httpResponseCache[key] = httpResponse;
    }

    get = (key: string): HttpResponse<any> | null | undefined => this.httpResponseCache[key];

    evict = (key: string): boolean => delete this.httpResponseCache[key];

    evictCache = (): void => {
        console.log('Clearing cache!');
        this.httpResponseCache = {};
    } 

    logCache = (): void => console.log(this.httpResponseCache);    
}
