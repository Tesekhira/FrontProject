import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private _isLoggedIn:boolean=false;
  private _codeError:Number;
  constructor(private http:HttpClient) {
    this.init();
  }

  init(){
    return localStorage.getItem("utilisateur")==null? this._isLoggedIn=false : this._isLoggedIn=true;
  }

  isLoggedIn(){
    return this._isLoggedIn;
  }

  getUser(){
    return localStorage.getItem("utilisateur");
  }
  setUser(newVal){
    localStorage.setItem("utilisateur",newVal);
  }
  Logout(){
    this._isLoggedIn=false;
    this._codeError=0;
    localStorage.removeItem("utilisateur");
  }
  LogIn(model){
    let url2="http://localhost:8080/app/user/login";
    return this.http.post(url2,model).toPromise().then(
      data => {
                          localStorage.setItem("utilisateur",JSON.stringify(data));
                          this._isLoggedIn=true;
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
      return this.http.post(url,model).toPromise().then(
        res=>{
          this._isLoggedIn=true;
        },
        err=>{
              this._isLoggedIn=false;
              this._codeError=err.status;
        }
      );
    }else{
      return this.http.post(url2,model).toPromise().then(
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
}
