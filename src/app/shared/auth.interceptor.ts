import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthService){}
    
    //Add an auth token to any request if the token is available (it's optional, only needed for writing)
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        console.log("Http request intercepted.");
        return this.authService.getAuthState().first().map(
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

    /* 
    Note: By default, Angular's HttpClient observables run .complete() when an HTTP request finishes, so 
    it's not necessary to unsubscribe. In this intercept function, the "first()" method was added on 
    line 14 so that the observable returned by intercept() could also complete, otherwise it would be 
    derived from a source that never completes (the AuthState observable), and any subscriptions created 
    by any components requesting data from an HTTP request would remain active. This would lead to unwanted 
    behaviors if the source AuthState observable emits new values.
    */
}