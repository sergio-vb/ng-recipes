import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class AuthService {
    private token: string;
    private userId: string;
    
    private _authState = new ReplaySubject<any>(1);
    private authState = this._authState.asObservable(); //Hides the observer-side of the subject, so .next() is not available out of AuthService

    constructor(private router: Router){}

    init(){
        firebase.auth().onAuthStateChanged(
            (user:any) => {
                this.token = user ? user.pa : "";
                this.userId = user ? user.uid : "";
                this._authState.next({
                    token: this.token, 
                    userId: this.userId
                });
                console.log("Auth state changed, userId:", this.userId);
            },
            error => {
                this._authState.error("Firebase auth state error.");
            }
        );  
    }

    //Use this to get the current state of authentication for validation
    getLatestAuthState(){
        return this.authState.first();
    }

    //Use this to create on-going subscriptions to react to authentication changes. This observable never completes on its own.
    getAuthState(){
        return this.authState;
    }

    signupUser(email: string, password: string){
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }
    
    loginUser(email: string, password: string){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    logoutUser(){
        return firebase.auth().signOut();
    }
    
}