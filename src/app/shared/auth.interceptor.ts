import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthService){}
    
    //Add an auth token to any request if the token is available (it's optional, since it's not needed for reading recipes)
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        //console.log('Intercepted request: ', req);
        let token;
        try{
            token = this.authService.getToken();
        }catch(e){
            token = '';
            console.log("Error:", e);
        }

        let request;
        if (token){
            request = req.clone({
                params: req.params.set('auth', token)
            });
        }else{
            request = req
        }

        return next.handle(request);
    }
}