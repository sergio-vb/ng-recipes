import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activePage:string = "recipes";
  
  onPageChange(data){
    this.activePage = data.active;
  }
}
