import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthentificationService} from "../../Service/Authentification/authentification.service";
import {HttpService} from "../../Service/Http/http.service";
import {ToastService} from "../../Service/Toast/toast.service";
import {MatDialog} from "@angular/material";
import {ModalComponent} from "../modal/modal.component";

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
     recommander:[],
     recommandation:[],
     signales:[],
     commandes:[],
     listeSignale:new Array<any>(),
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
     recommander:[],
     recommandation:[],
     signales:[],
     commandes:[],
     listeSignale:new Array<any>(),
     truePass:'',
     mypass:'',
     nvPass:'',
     nv2Pass:''
   }
   utili = null;
   passwordError = 0;
   TypeCompte = 1;
   emailError = 0;
   password: string = '';
   DisplayRecommande : boolean = false ;
  DisplayFormSignale : boolean = false
  selectedValue= "";
  tableId = new Array<Number>();
  t =  [1,2,1];
  constructor(public auth:AuthentificationService,public http:HttpService,
              private router: Router,public dialog: MatDialog,
              private toast:ToastService)
  {
    if(this.auth.isLoggedIn())
    {
      this.utili=this.auth.getUser();
      this.TypeCompte=this.utili.type;
    }
  }

  ngOnInit() {
   this.init();

  }
  init()
  {
    if(this.auth.isLoggedIn())
      this.utili=this.auth.getUser();
      if(this.utili !== null)
      {
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

        if(this.model.type  ===   1 && this.utili.adress)
          this.formEdit.adress=this.model.adress=this.utili.adress;

        if(this.model.type ===  2 && this.utili.path_img)
          this.formEdit.path_img=this.model.path_img=this.utili.path_img;
        if(this.utili.commandes != null)
          this.formEdit.commandes=this.model.commandes=this.utili.commandes;
        if(this.model.type === 1 && this.utili.recommander != null)
          this.formEdit.recommander=this.model.recommander=this.utili.recommander;

        if(this.model.type === 2 && this.utili.recommandation != null)
          this.formEdit.recommandation=this.model.recommandation=this.utili.recommandation;

        if(this.model.type === 2 && this.utili.signales != null)
          this.formEdit.signales=this.model.signales=this.utili.signales;

        this.formEdit.truePass=this.model.truePass=this.auth.getPass();

          if(this.model.type === 1 && this.model.commandes.length !== 0){
            this.chargerLivreurName(this.model.commandes);
          }
          else if(this.model.type === 2 && this.model.commandes.length !== 0)
            this.chargerClientName(this.model.commandes);
          if(this.model.type === 1 && this.model.recommander.length !== 0 )
            this.ChargerLivreurArecommander(this.model.recommander);


        if(this.model.type === 2 && this.model.signales !== null && this.model.signales.length !== 0 )
          {
            this.ChargerClientSignaler(this.model.signales);
          }
        }
  }
  LogOut():void{
    this.auth.Logout();
    this.router.navigate(['/signin']);
  }
  chargerLivreurName(table : any){
    let url="http://localhost:8080/app/livreur";

    for(let i=0; i < table.length;i++){
      let newUrl=url+"/"+table[i].livreur_id;
      this.http.getHttp(newUrl,1,null).then(
        result=>{
          if(result !== null)
          {
            table[i].livreur=result;
            table[i].comition=(table[i].total*0.10).toFixed(2);
            switch (table[i].etat_cmd)
            {
              case 0:
                table[i].classe="partime";
                break;
              case 1 :
                table[i].classe="freelance";
                break;
              case 2:
                table[i].classe="fulltime";
                break;
              case 3:
                table[i].classe="succes";
                break;

            }
          }

        },err=>{

        });
    }

  }
  isInArray(value) {
    return this.tableId.indexOf(value) > -1;
  }

  chargerClientName(table : any){
    let url="http://localhost:8080/app/client";
    console.log("leng " + table.length);
    for(let i=0; i < table.length;i++){
      let newUrl=url+"/"+table[i].client_id;
      this.http.getHttp(newUrl,1,null).then(
        result=>{
          if(result !== null)
          {
            table[i].client=result;
            table[i].comition=(table[i].total*0.10).toFixed(2);
            if(this.isInArray(table[i].client.id) === false )
            {
              this.tableId.push(this.t[i]);
              this.model.listeSignale.push(table[i].client);
            }

            switch (table[i].etat_cmd)
            {
              case 0:
                table[i].classe="partime";
                break;
              case 1 :
                table[i].classe="freelance";
                  break;
              case 2:
                table[i].classe="fulltime";
                break;
              case 3:
                table[i].classe="succes";
                break;

            }
          }

        },err=>{

        });

    }
  }
  ChargerLivreurArecommander(table : any){
    let url="http://localhost:8080/app/livreur";
    for(let i=0; i < table.length;i++){
      let newUrl=url+"/"+table[i].livreur_id;
      this.http.getHttp(newUrl,1,null).then(
        result=>{
          if(result !== null)
          {
            table[i].livreur=result;
            switch (table[i].etat) {
              case 0:
                table[i].classe="vide";
                break;
              case 1:
                table[i].classe="succes";
                break;

              case -1:
                table[i].classe="partime";
                break;
            }
          }

        },err=>{

        });
    }
  }
  ChargerClientSignaler(table : any){
    let url="http://localhost:8080/app/client";
    for(let i=0; i < table.length;i++){
      let newUrl=url+"/"+table[i].client_id;
      this.http.getHttp(newUrl,1,null).then(
        result=>{
          if(result !== null)
          {
            table[i].client=result;
            if(table[i].etat_signale)
            {
              table[i].class= "freelance";
            }
            else{
              table[i].class= "partime";
            }
          }

        },err=>{

        });
    }
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

    if(this.model.type ===  1 && this.utili.adress)
      this.formEdit.adress=this.model.adress=this.utili.adress;

    if(this.model.type ===  2 && this.utili.path_img)
      this.formEdit.path_img=this.model.path_img=this.utili.path_img;

    if(this.model.type ===  2 && this.utili.signales)
      this.formEdit.signales=this.model.signales=this.utili.signales;

    this.passwordError = 0;
    this.emailError = 0;
    this.password = '';
  }
  SauvgarderEditForm():void{

    let url="http://localhost:8080/app/client/update";
    let url2="http://localhost:8080/app/livreur/update";
    if(this.auth.validateEmail(this.formEdit.email))
    {
      if(this.model.type ===  1)
      {
        this.openDialog().then(result => {
              this.password = result;
          }).then(()=>{
            if(this.password === this.auth.getPass()){
                this.http.patchHttp(url,this.formEdit,2,this.utili).then(
                  res=>{
                    if(res !== null){
                      let token=this.utili.token;
                      this.utili=res;
                      this.utili.token=token;
                      this.auth.setUser(this.utili);
                      this.init();
                      this.toast.CreateToast('success','Modification effectuée','Votre modification est enregistrer');
                    }else {
                      this.emailError=2;
                    }
                  },
                  error=>{

                  }
                );
            }else if(this.password === undefined){
              this.ResetEditForm();
              this.toast.CreateToast('warning','Modification','Votre modification est annuler');
            }
            else{

              this.ResetEditForm();
              this.toast.CreateToast('error','Modification annuler',' Votre mot de passe est incorrect ');
            }

        });
      }
      else if(this.model.type ===  2){
        this.openDialog().then(result => {
          this.password = result;
        }).then(()=>{
          if(this.password === this.auth.getPass()){
            this.http.patchHttp(url2,this.formEdit,2,this.utili).then(
              res=>{
                if(res !== null){
                  let token=this.utili.token;
                  this.utili=res;
                  this.utili.token=token;
                  this.auth.setUser(this.utili);
                  this.init();
                  this.toast.CreateToast('success','Modification effectuée','Votre modification est enregistrer');
                }else {
                  this.emailError=2;
                }
              },
              error=>{

              }
            );
          }else if(this.password === undefined){
            this.ResetEditForm();
            this.toast.CreateToast('warning','Modification','Votre modification est annuler');
          }
          else{

            this.ResetEditForm();
            this.toast.CreateToast('error','Modification annuler',' Votre mot de passe est incorrect ');
          }

        });
      }
    }else{
      this.emailError = 1;
    }

  }
  SauvgarderCompteEdit(){
    let url="http://localhost:8080/app/client/CompteUpdate";
    let url2="http://localhost:8080/app/livreur/CompteUpdate";
    if(this.formEdit.mypass  ===   this.auth.getPass()){
      if(this.formEdit.nv2Pass  ===   this.formEdit.nvPass)
      {
        if(this.formEdit.nvPass !== this.auth.getPass()){
          if(this.model.type ===  1)
          {
            this.formEdit.password=this.formEdit.nvPass;
            this.http.patchHttp(url,this.formEdit,2,this.utili).then(
              res=>{
                this.passwordError=0;
                this.toast.CreateToast('success','Modification effectuée','Votre mot de passe est changé');
                this.LogOut();
              },
              error=>{

              }
            );
          }
          else if(this.model.type  ===   2){
            this.formEdit.password=this.formEdit.nvPass;
            this.http.patchHttp(url2,this.formEdit,2,this.utili).then(
              res=>{
                this.passwordError=0;
                this.toast.CreateToast('success','Modification effectuée','Votre mot de passe est changé');
                this.LogOut();
              },
              error=>{

              }
            );
          }
        }else{
          this.toast.CreateToast('warning','Mot de passe',"Le nouveau mot de passe saisie est le même que l'ancien");
        }
      }
      else{
        console.log("erreur non identique ");
        this.passwordError=1;
      }
    }else{
      //console.log("erreur mot de passe");
      this.passwordError=2;
    }

  }
  openDialog() {
    this.password='';
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '430px',
      data: {password: this.password}
    });

    return dialogRef.afterClosed().toPromise();
  }
  ChangeRecom(rec,val){
    let url="http://localhost:8080/app/recommander/update";
    rec.etat = val;
    switch (rec.etat) {
      case 0:
        rec.classe="vide";
        break;
      case 1:
        rec.classe="succes";
        break;

      case -1:
        rec.classe="partime";
        break;
    }
    this.http.patchHttp(url,rec,2,this.auth.getUser()).then(
      res=>{
                  rec=res;
      },err=>{

      }
    )

  }
  Signaler(sig){
    let url="http://localhost:8080/app/signale/update";
      sig.etat_signale = !sig.etat_signale;
      if(sig.etat_signale)
      {
        sig.class= "freelance";
      }
      else{
        sig.class= "partime";
      }
    this.http.patchHttp(url,sig,2,this.auth.getUser()).then(
      res =>{
              sig = res ;
      },err =>{

      }
    );
  }
  AddSignaler(client,id_client)
  {
    let url="http://localhost:8080/app/signale/create";
    let url2="http://localhost:8080/app/livreur/"+this.utili.id;
    this.DisplayFormSignale  === true ? this.DisplayFormSignale = false : this.DisplayFormSignale = true;

    this.http.postHttp(url,{client_id : id_client , livreur_id : this.utili.id ,etat_signale : true},2,this.utili).then(
      res =>{
              let val = res;
              this.http.getHttp(url2,1,null).then(
                result=>{
                  if(result !== null)
                  {
                      this.auth.LogIn({email : this.utili.email , password : this.auth.getPass()}).then(res=> {
                        this.model.listeSignale.splice(this.model.listeSignale.indexOf(client),1);
                        this.init();
                    });
                  }
                  },err =>{
                      console.log("11111");
                      console.log(err);
                  });
              },error => {
        console.log("2222");

        console.log(error);
      }
    );
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
  signales:Array<any>,
  truePass:string,
  mypass:string,
  nvPass:string,
  nv2Pass:string,
  listeSignale:Array<any>
}


