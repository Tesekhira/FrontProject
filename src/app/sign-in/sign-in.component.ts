import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  model:AuthentificationView={
    email:'',
    password:''
   }
  //'Authorization': 'my-auth-token'
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(private http:HttpClient,private router: Router) { }

  ngOnInit() {
  }
  authentifier():void{
    let url2="http://localhost:8080/app/user/login";
    this.http.post(url2,this.model,this.httpOptions).subscribe(
      data => {
        localStorage.setItem("utilisateur",JSON.stringify(data));
        this.router.navigate(['/profile']);
      },
      error => {
        console.log("Error", error);
      }
    );
  }


}
export interface AuthentificationView{
  email:string;
  password:string;
}
