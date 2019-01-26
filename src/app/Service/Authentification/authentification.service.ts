import { Injectable } from '@angular/core';
import {HttpService} from '../Http/http.service';
import {SocketService} from '../Socket/socket.service';
import {DataService} from '../Data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private _isLoggedIn = false;
  private _codeError: Number;
  private _token = '';
  private _turePass = '';
  private _goTo  = '/';
  constructor(private http: HttpService, private  socketService: SocketService, private servicedata: DataService) {
    this.init();
  }
  /***
   * Charger All
   */
  chargerTous() {
    if (this.isLoggedIn()) {
      this.servicedata.setUser(this.getUser());
      this.servicedata.setCommandes(this.getUser().commandes);
      this.servicedata.setNotif(this.getNbNotification());
      this.socketService.connect();
    }
  }
  init() {
    return localStorage.getItem('utilisateur') === null ? this._isLoggedIn = false : this._isLoggedIn = true;
  }

  isLoggedIn() {
    return this._isLoggedIn;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('utilisateur'));
  }
  setUser(newVal) {
    localStorage.setItem('utilisateur', JSON.stringify(newVal));
  }
  Logout() {
    this._isLoggedIn = false;
    this._codeError = 0;
    this._token = '';
    localStorage.clear();
  }
  LogIn(model) {
    const url2 = 'http://localhost:8080/app/user/login';
      return this.http.postHttp(url2, model, 1, null).then(
      data => {
                        if (data != null) {
                          localStorage.setItem('utilisateur', JSON.stringify(data));
                          this._isLoggedIn = true;
                          this._turePass = model.password;
                          localStorage.setItem('truePass', this._turePass);
                          this.socketService.connect();
                        } else {
                          this._isLoggedIn = false;
                          this._codeError = 500;
                        }
                        },
      error => {
                         this._isLoggedIn = false;
                         this._codeError = error.status;
                          console.log('Error', error.status);
                       }
          );

  }
  getCode() {
    return this._codeError;
  }

  Inscrire(model) {
    const url = 'http://localhost:8080/app/livreur/create';
    const url2 = 'http://localhost:8080/app/client/create';
    if (model.typeCompte) {
        return this.http.postHttp(url, model, 1, null).then(
        res => {
          this._isLoggedIn = false;
          this._codeError = 0;
        },
        err => {
              this._isLoggedIn = false;
              this._codeError = err.status;
        }
      );
    } else {
      return this.http.postHttp(url2, model, 1, null).then(
        res => {
          this._isLoggedIn = false;
          this._codeError = 0;
        },
        err => {
          this._isLoggedIn = false;
          this._codeError = err.status;
        }
      );
    }

  }

  validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  }
  getPass() {
    if (this._turePass === '') {
      return localStorage.getItem('truePass');
    }
    return this._turePass;
  }
  getTo() {
    return this._goTo;
  }
  setTo(value) {
    this._goTo = value;
  }
  getTypeCompte() {
    const user = this.getUser();
    if (user !== null) {
      return user.type;
    }
  }
  getNbNotification() {
    const user = this.getUser();
    const tab: Array<any> = [] ;
    if (user !== null && user.commandes !== null && user.commandes.length !== 0 ) {
      const cmds = user.commandes;
      for (const ind in cmds) {
        if (cmds[ind].etat_cmd === 0 ) {
          tab[tab.length] = cmds[ind];
        }
      }
      return tab;
    } else {
      return tab;
    }

  }

  getCmdAccept() {
    const user = this.getUser();
    const tab: Array<any> = [] ;
    if (user !== null && user.commandes !== null && user.commandes.length !== 0 ) {
      const cmds = user.commandes;
      for (const ind in cmds) {
        if (cmds[ind].etat_cmd === 1 || cmds[ind].etat_cmd === 2 ) {
          tab[tab.length] = cmds[ind];
        }
      }
      return tab;
    } else {
      return tab;
    }

  }
  getCmdEnCours() {
    const user = this.getUser();
    const tab: Array<any> = [] ;
    if (user !== null && user.commandes !== null && user.commandes.length !== 0 ) {
      const cmds = user.commandes;
      for (const ind in cmds) {
        if (cmds[ind].etat_cmd === 2 ) {
          tab[tab.length] = cmds[ind];
        }
      }
      return tab;
    } else {
      return tab;
    }

  }


}
