import { Component, OnInit  } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";
import {AuthentificationService} from "../../Service/Authentification/authentification.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  model:UtilisateurView={
    email:'',
    password:'',
    repasse:'',
    typeCompte:false
  };
  pass2Error:boolean=false;
  emailIncorrect:Number=0;
  constructor(public auth:AuthentificationService,private router: Router) { }

  ngOnInit() {
  }

  Inscrire():void{
    if(this.auth.validateEmail(this.model.email)==false){
      this.emailIncorrect=2;
    } else if(this.model.password == this.model.repasse) {
      this.emailIncorrect=0;
     this.auth.Inscrire(this.model).then(()=>{
       this.pass2Error=false;
       if(this.auth.isLoggedIn())
         this.router.navigate(['/profile']);
     });
    }else{
      this.emailIncorrect=0;
      this.pass2Error=true;
    }

  }

}

export interface UtilisateurView{
  email:string;
  password:string;
  repasse:string;
  typeCompte:boolean;
}
