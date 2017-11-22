import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  activePage:string = "recipes";
  
  ngOnInit(){
    firebase.initializeApp({
      apiKey: "AIzaSyAPuNh-cpkl1VHSvu3uXxt3c87fcstMMsc",
      authDomain: "ng-recipes-1sv94.firebaseapp.com",
    });
  }
  onPageChange(data){
    this.activePage = data.active;
  }
}
