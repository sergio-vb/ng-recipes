import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
    private token: string;
    private userId: string;

    constructor(private router: Router){}

    init(){
        firebase.auth().onAuthStateChanged(
            (user:any) => {
                this.token = user ? user.pa : "";
                this.userId = user ? user.uid : "";
            }
        );  
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

    //Synchronously returns the cached token, and asynchronously refreshes it.
    getToken(){
        const currentUser = firebase.auth().currentUser;
        if (currentUser){
            currentUser.getIdToken().then(token => {
                this.token = token;
            });
        }
        return this.token;
    }

    isAuthenticated(){
        return !!this.token;
    }

    getUserId(){
        return this.userId;
    }
}