import { Injectable } from '@angular/core';
import {AuthentificationService} from '../Authentification/authentification.service';
import {SocketService} from '../Socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _Livreur: any = null;
  private _commande: any = null;
  private _Utilisateur: any = null;
  private  _notif: any = null;
  private  _Comms: any = null;
  constructor() { }

  /*****
   * Livreur
   */
  getLivreur() {
    return this._Livreur;
  }
  setLivreur(data) {
    this._Livreur = data;
  }
  /*****
   * Commande
   */
  getCommande() {
    return this._commande;
  }
  setCommande(data) {
    this._commande = data;
  }


  /*****
   * Liste Commande
   */
  getCommandes() {
    return this._Comms;
  }
  setCommandes(data) {
    this._Comms = data;
  }
  /*****
   * Utilisateur
   */
  getUser() {
    return this._Utilisateur;
  }
  setUser(data) {
    this._Utilisateur = data;
  }

  /*****
   * notif
   */
  getNotif() {
    return this._notif;
  }
  setNotif(data) {
    this._notif = data;
  }

  /***
   * Clean All
   */
  clean() {
    this._commande = null;
    this._Livreur = null;
    this._Utilisateur = null;
    this._notif = null;
  }

}
