import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService
  ){}
  
  ngOnInit(){
    const config = {
      apiKey: "AIzaSyAPuNh-cpkl1VHSvu3uXxt3c87fcstMMsc",
      authDomain: "ng-recipes-1sv94.firebaseapp.com",
      databaseURL: "https://ng-recipes-1sv94.firebaseio.com",
      projectId: "ng-recipes-1sv94",
      storageBucket: "ng-recipes-1sv94.appspot.com",
      messagingSenderId: "413228234743"
    };
    firebase.initializeApp(config);
    this.authService.init();
  }

}
