import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthentificationService} from "../Authentification/authentification.service";

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
   emailIncorrect:Number=0;
  constructor(private http:HttpClient,private router: Router,public auth:AuthentificationService) { }
  ngOnInit() {
  }

  authentifier():void{
    if(this.model.email=='' || this.model.password==''){
        this.emailIncorrect=1;
    }else if(this.auth.validateEmail(this.model.email)==false){
      this.emailIncorrect=2;
    }else{
      this.emailIncorrect=0;
      this.auth.LogIn(this.model).then(()=>{
        if(this.auth.isLoggedIn())
          this.router.navigate(['/profile']);
        else
          console.log("this password / email invalide");
      });
    }

  }


}
export interface AuthentificationView{
  email:string;
  password:string;
}
