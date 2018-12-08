import { Component, OnInit  } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";

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

  //'Authorization': 'my-auth-token'
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(private http:HttpClient,private router: Router) { }

  ngOnInit() {
  }

  Inscrire():void{
    let url="http://localhost:8080/app/livreur/create";
    let url2="http://localhost:8080/app/client/create";

    if(this.model.password == this.model.repasse) {
      if(this.model.typeCompte)
      {
        this.http.post(url,this.model,this.httpOptions).subscribe(
          res=>{
            location.reload();
          },
            err=>{
            alert("Votre commande non executer");
          }
        );
      }else{

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

    }else{
      alert("Erreur mot de passe ");
    }

  }

}

export interface UtilisateurView{
  email:string;
  password:string;
  repasse:string;
  typeCompte:boolean;
}
