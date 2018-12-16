import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthentificationService} from "../../Service/Authentification/authentification.service";
import {HttpService} from "../../Service/Http/http.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

   model:UserView={
     id:null,
     email:'',
     password:'',
     token:'',
     nom:'',
     prenom:'',
     adress:'',
     date:null,
     path_img:'',
     type:null,
     recommander:null,
     recommandation:null,
     commandes:null,
     truePass:'',
     mypass:'',
     nvPass:'',
     nv2Pass:''
   };
   formEdit:UserView={
     id:null,
     nom:'',
     prenom:'',
     adress:'',
     email:'',
     password:'',
     token:'',
     date:null,
     path_img:'',
     type:null,
     recommander:null,
     recommandation:null,
     commandes:null,
     truePass:'',
     mypass:'',
     nvPass:'',
     nv2Pass:''
   }
   utili=null;
   passwordError=0;
   TypeCompte=1;
  constructor(public auth:AuthentificationService,public http:HttpService,private router: Router) {
    if(this.auth.isLoggedIn()){
      this.utili=this.auth.getUser();
      this.TypeCompte=this.utili.type;
    }
  }

  ngOnInit() {
   this.init();
  }
  init(){
    if(this.auth.isLoggedIn())
      this.utili=this.auth.getUser();

    if(this.utili.id)
      this.formEdit.id=this.model.id=this.utili.id;
    if(this.utili.email)
      this.formEdit.email=this.model.email=this.utili.email;
    if(this.utili.password)
      this.formEdit.password=this.model.password=this.utili.password;
    if(this.utili.token)
      this.formEdit.token=this.model.token=this.utili.token;
    if(this.utili.nom)
      this.formEdit.nom=this.model.nom=this.utili.nom;
    if(this.utili.prenom)
      this.formEdit.prenom=this.model.prenom=this.utili.prenom;
    if(this.utili.date)
      this.formEdit.date=this.model.date=this.utili.date.substring(0,10);

    if(this.utili.type)
      this.formEdit.type=this.model.type=this.utili.type;

    if(this.model.type==1 && this.utili.adress)
      this.formEdit.adress=this.model.adress=this.utili.adress;

    if(this.model.type==2 && this.utili.path_img)
      this.formEdit.path_img=this.model.path_img=this.utili.path_img;
    if(this.utili.commandes.length!=0)
      this.formEdit.commandes=this.model.commandes=this.utili.commandes;
    if(this.model.type==1 && this.utili.recommander.length!=0)
      this.formEdit.recommander=this.model.recommander=this.utili.recommander;

    if(this.model.type==2 && this.utili.recommandation.length!=0)
      this.formEdit.recommandation=this.model.recommandation=this.utili.recommandation;

    this.formEdit.truePass=this.model.truePass=this.auth.getPass();
  }
  LogOut():void{
    this.auth.Logout();
    this.router.navigate(['/signin']);
  }

  ResetEditForm():void{
    if(this.utili.id)
      this.formEdit.id=this.model.id=this.utili.id;
    if(this.utili.email)
      this.formEdit.email=this.model.email=this.utili.email;
    if(this.utili.password)
      this.formEdit.password=this.model.password=this.utili.password;
    if(this.utili.token)
      this.formEdit.token=this.model.token=this.utili.token;
    if(this.utili.nom)
      this.formEdit.nom=this.model.nom=this.utili.nom;
    if(this.utili.prenom)
      this.formEdit.prenom=this.model.prenom=this.utili.prenom;
    if(this.utili.date)
      this.formEdit.date=this.model.date=this.utili.date.substring(0,10);

    if(this.utili.type)
      this.formEdit.type=this.model.type=this.utili.type;

    if(this.model.type==1 && this.utili.adresse)
      this.formEdit.adress=this.model.adress=this.utili.adress;

    if(this.model.type==2 && this.utili.path_img)
      this.formEdit.path_img=this.model.path_img=this.utili.path_img;
  }
  SauvgarderEditForm():void{

    let url="http://localhost:8080/app/client/update";
    let url2="http://localhost:8080/app/livreur/update";

    if(this.model.type==1)
    {
      this.http.patchHttp(url,this.formEdit,2,this.utili).then(
        res=>{
              let token=this.utili.token;
              this.utili=res;
              this.utili.token=token;
              this.auth.setUser(this.utili);
              this.init();
        },
          error=>{

            }
      );
    }
    else if(this.model.type==2){
      console.log("################################");
      console.log(this.utili);
      this.http.patchHttp(url2,this.formEdit,2,this.utili).then(
        res=>{
              let token=this.utili.token;
              this.utili=res;
              this.utili.token=token;
              this.auth.setUser(this.utili);
              this.init();
        },
        error=>{

        }
      );
    }
  }
  SauvgarderCompteEdit(){
    let url="http://localhost:8080/app/client/CompteUpdate";
    let url2="http://localhost:8080/app/livreur/CompteUpdate";
    if(this.formEdit.mypass == this.model.truePass){
      if(this.formEdit.nv2Pass == this.formEdit.nvPass){
        if(this.model.type==1)
        {
          this.formEdit.password=this.formEdit.nvPass;
          this.http.patchHttp(url,this.formEdit,2,this.utili).then(
            res=>{
              this.passwordError=0;
              this.LogOut();
            },
            error=>{

            }
          );
        }
        else if(this.model.type==2){
          this.formEdit.password=this.formEdit.nvPass;
          this.http.patchHttp(url2,this.formEdit,2,this.utili).then(
            res=>{
              this.passwordError=0;
              this.LogOut();
            },
            error=>{

            }
          );
        }
      }
      else{
        console.log("erreur non identique ");
        this.passwordError=1;
      }
    }else{
      console.log("erreur mot de passe");
      this.passwordError=2;
    }

  }
}
export interface UserView{
  id:Number;
  email:string;
  password:string;
  token:string;
  nom:string;
  prenom:string;
  date:Date;
  adress:string;
  path_img:string;
  type:Number,
  commandes:[],
  recommander:[],
  recommandation:[],
  truePass:string,
  mypass:string,
  nvPass:string,
  nv2Pass:string
}


