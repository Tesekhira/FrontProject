import { Component, OnInit } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
   utili=JSON.parse(localStorage.getItem("utilisateur"));
   model:ClientView={
     email:'',
     password:'',
     token:'',
     nom:'',
     prenom:'',
     adresse:'',
     date:null
   };
   modelLiv:LivreurView={
     email:'',
     password:'',
     token:'',
     nom:'',
     prenom:'',
     path_img:'',
     date:null
   };
   formEdit:FormEdit={
     id:null,
     nom:'',
     prenom:'',
     adresse:'',
     email:'',
     password:'',
     token:'',
     date:null
   }
  constructor(private http:HttpClient,private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  ngOnInit() {
    if(this.utili!=null && this.utili.token!=null){
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization':this.utili.token
        })
      };
    }
    switch (this.utili.type) {
      case 1:
        if(this.utili.id)
          this.formEdit.id=this.utili.id;
        if(this.utili.email)
          this.formEdit.email=this.model.email=this.utili.email;
        if(this.utili.password)
          this.formEdit.password=this.model.password=this.utili.password;
        if(this.utili.token)
          this.formEdit.token=this.model.token=this.utili.token;
        if(this.utili.nom){}
        this.formEdit.nom=this.model.nom=this.utili.nom;
        if(this.utili.prenom)
          this.formEdit.prenom=this.model.prenom=this.utili.prenom;
        if(this.utili.adresse)
          this.formEdit.adresse=this.model.adresse=this.utili.adresse;
        if(this.utili.date)
          this.formEdit.date=this.model.date=this.utili.date.substring(0,10);
        break;
      case 2:
          if(this.utili.email)
            this.modelLiv.email=this.utili.email;
          if(this.utili.password)
            this.modelLiv.password=this.utili.password;
          if(this.utili.token)
            this.modelLiv.token=this.utili.token;

          if(this.utili.nom)
            this.modelLiv.nom=this.utili.nom;
          if(this.utili.prenom)
            this.modelLiv.prenom=this.utili.prenom;
          if(this.utili.date)
            this.modelLiv.date=this.utili.date.substring(0,10);
          if(this.utili.path_img)
            this.modelLiv.path_img=this.utili.path_img;
        break;

    }

  }
  LogOut():void{
    localStorage.removeItem("utilisateur");
    this.router.navigate(['/signin']);
  }

  ResetEditForm():void{
    this.formEdit.id=this.utili.id;
    this.formEdit.nom=this.model.nom;
    this.formEdit.prenom=this.model.prenom;
    this.formEdit.adresse=this.model.adresse;
  }
  SauvgarderEditForm():void{
    let url="http://localhost:8080/app/client/update";
    let url2="http://localhost:8080/app/livreur/update";

    switch (this.utili.type) {
      case 1:
          this.http.put(url,this.formEdit,this.httpOptions).subscribe(
            res=>{

            },
            err=>{
              alert("Votre commande non executer");
            }
          );
        break;
      case 2:

        break;
    }
  }
}
export interface ClientView{
  email:string;
  password:string;
  token:string;
  nom:string;
  prenom:string;
  date:Date;
  adresse:string;
}

export interface LivreurView{
  email:string;
  password:string;
  token:string;
  nom:string;
  prenom:string;
  date:Date;
  path_img:string;
}

export interface FormEdit{
  id:Number;
  nom:string;
  prenom:string;
  adresse:string;
  email:string;
  password:string;
  token:string;
  date:Date;
}

export interface FormCompte{
  id:Number;
  email:string;
  password:string;
  nv_pass:string;
  nv_pass2:string;
}
