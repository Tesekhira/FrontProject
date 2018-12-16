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
    localStorage.removeItem("utilisateur");
  }
  LogIn(model){
    let url2="http://localhost:8080/app/user/login";
      return this.http.postHttp(url2,model,1,null).then(
      data => {
                          localStorage.setItem("utilisateur",JSON.stringify(data));
                          this._isLoggedIn=true;
                          this._turePass=model.password;
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
          this._isLoggedIn=true;
        },
        err=>{
              this._isLoggedIn=false;
              this._codeError=err.status;
        }
      );
    }
    else{
      return this.http.postHttp(url,model,1,null).then(
        res=>{
          this._isLoggedIn=true;
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
    return this._turePass;
  }
}
