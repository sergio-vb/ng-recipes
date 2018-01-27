import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthService){}
    
    //Add an auth token to any request if the token is available (it's optional, only needed for writing)
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return this.authService.authState.map(
            authState => authState.token,
            error => ""
        ).flatMap(
            token => {
                let request = token ? req.clone({
                    params: req.params.set('auth', token)
                }) : req;
                return next.handle(request);
            }
        );
    }
}