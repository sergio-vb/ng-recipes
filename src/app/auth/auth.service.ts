import * as firebase from 'firebase';

export class AuthService {
    token: string;

    signupUser(email: string, password: string){
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(
                error => console.log(error)
            )
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
        }catch(error){
            console.log(error);
            return;
        }
        this.token = await firebase.auth().currentUser.getToken();
    }

    async getToken(){
        this.token = await firebase.auth().currentUser.getToken();
        return this.token;
    }

    isAuthenticated(){
        return this.token != null;
    }

    logoutUser(){
        firebase.auth().signOut();
        this.token = null;
    }
}