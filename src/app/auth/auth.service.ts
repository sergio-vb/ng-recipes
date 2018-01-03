import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
    token: string;
    private userEmail: string;

    constructor(private router: Router){}

    async signupUser(email: string, password: string){
        try{
            const signUpResult = await firebase.auth().createUserWithEmailAndPassword(email, password);
            this.token = signUpResult.pa;
            this.userEmail = email;
            this.router.navigate(['/']);
        }catch(error){
            console.log(error);
        }
    }

    // Example method using promises:
    // signinUser(email: string, password: string){
    //     firebase.auth().signInWithEmailAndPassword(email, password)
    //         .then(
    //             response => {
    //                 firebase.auth().currentUser.getToken()
    //                     .then(
    //                         (token: string) => this.token
    //                     )
    //             }
    //         )
    //         .catch(
    //             error => console.log(error)
    //         );
    // }

    //Method refactored to use async/await:
    async loginUser(email: string, password: string){
        try{
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            this.token = response.pa;
            this.userEmail = email;
            this.router.navigate(['/']);
        }catch(error){
            console.log(error);
            return;
        }
    }

    getToken(){
        firebase.auth().currentUser.getIdToken().then(token => {
            this.token = token;
        });
        return this.token;
    }

    isAuthenticated(){
        return this.token != null;
    }

    logoutUser(){
        firebase.auth().signOut();
        this.userEmail = "";
        this.token = null;
        this.router.navigate(['/']);
    }
}