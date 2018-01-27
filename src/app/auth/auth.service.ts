import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class AuthService {
    private token: string;
    private userId: string;
    
    private _authState = new ReplaySubject<any>();
    private authState = this._authState.asObservable(); //Hides the observer-side of the subject out of AuthService

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

    getAuthState(){
        return this.authState;
    }

    async signupUser(email: string, password: string){
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        this.router.navigate(['/']);
    }
    
    async loginUser(email: string, password: string){
        await firebase.auth().signInWithEmailAndPassword(email, password);
        this.router.navigate(['/']);
    }

    async logoutUser(){
        await firebase.auth().signOut();
        this.router.navigate(['/']);
    }

    isAuthenticated(){
        return !!this.token;
    }
}