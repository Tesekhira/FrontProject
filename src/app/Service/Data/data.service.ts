import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _Livreur: any = null;
  private _commande: any = null;
  private _Utilisateur: any = null;
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
   * Utilisateur
   */
  getUser() {
    return this._Utilisateur;
  }
  setUser(data) {
    this._Utilisateur = data;
  }


  /***
   * Clean All
   */
  clean() {
    this._commande = null;
    this._Livreur = null;
    this._Utilisateur = null;
  }
}
