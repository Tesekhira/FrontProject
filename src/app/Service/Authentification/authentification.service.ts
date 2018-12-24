import { Injectable } from '@angular/core';
import {HttpService} from "../Http/http.service";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private _isLoggedIn:boolean=false;
  private _codeError:Number;
  private _token:string='';
  private _turePass:string='';
  private _goTo : string = '/';
  constructor(private http:HttpService) {
    this.init();
  }

  init(){
    return localStorage.getItem("utilisateur")==null? this._isLoggedIn=false : this._isLoggedIn=true;
  }

  isLoggedIn(){
    return this._isLoggedIn;
  }

  getUser(){
    return JSON.parse(localStorage.getItem("utilisateur"));
  }
  setUser(newVal){
    localStorage.setItem("utilisateur",JSON.stringify(newVal));
  }
  Logout(){
    this._isLoggedIn=false;
    this._codeError=0;
    this._token='';
    localStorage.clear();
  }
  LogIn(model){
    let url2="http://localhost:8080/app/user/login";
      return this.http.postHttp(url2,model,1,null).then(
      data => {
                        if(data != null){
                          localStorage.setItem("utilisateur",JSON.stringify(data));
                          this._isLoggedIn=true;
                          this._turePass=model.password;
                          localStorage.setItem("truePass",this._turePass);
                        }else{
                          this._isLoggedIn=false;
                          this._codeError=500;
                        }
                        },
      error => {
                         this._isLoggedIn=false;
                         this._codeError=error.status;
                          console.log("Error", error.status);
                       }
          );

  }
  getCode(){
    return this._codeError;
  }

  Inscrire(model){
    let url="http://localhost:8080/app/livreur/create";
    let url2="http://localhost:8080/app/client/create";
    if(model.typeCompte){
        return this.http.postHttp(url,model,1,null).then(
        res=>{
          this._isLoggedIn = false;
        },
        err=>{
              this._isLoggedIn = false;
              this._codeError = err.status;
        }
      );
    }
    else{
      return this.http.postHttp(url2,model,1,null).then(
        res=>{
          this._isLoggedIn=false;
        },
        err=>{
          this._isLoggedIn=false;
          this._codeError=err.status;
        }
      );
    }

  }

  validateEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  }
  getPass(){
    if(this._turePass === '')
      return localStorage.getItem("truePass");
    return this._turePass;
  }
  getTo() {
    return this._goTo;
  }
  setTo(value) {
    this._goTo = value;
  }
  getTypeCompte() {
    var user=this.getUser();
    if(user !== null)
      return user.type;
  }
  getNbNotification(){
    var user=this.getUser();
    var tab : Array<any> = [] ;
    if(user !== null && user.commandes !== null && user.commandes.length !=0 ){
      var cmds=user.commandes;
      for(let ind in cmds){
        if(cmds[ind].etat_cmd ==0 )
          tab[tab.length] = cmds[ind];
      }
      return tab;
    }else
      return tab;

  }
}
