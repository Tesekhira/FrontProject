import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../Service/Data/data.service';
import {AuthentificationService} from '../../Service/Authentification/authentification.service';
import {HttpService} from '../../Service/Http/http.service';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {
  // utili = JSON.parse(localStorage.getItem('utilisateur'));
  errliv = 0;
  msgerr='';
  utili = null;
  arr: any[] = [];
  /*lc: LcView = {
    produit: 'test',
    quantite: '',
    prixmax: '',
  };*/

  model: CommandeView = {
    client_id: null,
    livreur_id: 3,
    etat_cmd : 0,
    lignes: [],
    type_cmd: false,
  };
  tmp: CommandeView = null;
  livreur: any = null;

  constructor(private http: HttpService,
              private router: Router,
              private servicedata: DataService,
              private auth: AuthentificationService) { }

  ngOnInit() {
    this.utili = this.auth.getUser();
    this.tmp = <CommandeView> this.servicedata.getCommande();
    this.livreur = this.servicedata.getLivreur();
    if (this.tmp !== null) {
      this.model = this.tmp;
    } else {
      this.model.lignes[this.model.lignes.length] = {nom_prod: 'test', quantite: null, prix_prod: null};
      this.servicedata.setCommande(this.model);
    }
    console.log(this.servicedata.getCommande());
  }



  envoyer(): void {
    const url2 = 'http://localhost:8080/app/cmd/create';
    //console.log(this.utili);
    this.msgerr='';
    if (this.livreur) {
      if ((this.livreur.etat_compte == 1 ) ||
        (this.livreur.etat_compte == 0 ) ||
        ((this.livreur.etat_compte == 2) && (this.model.type_cmd == false))) {
         if (this.auth.isLoggedIn() === true)  {
           this.model.client_id = this.utili.id;
           this.http.postHttp(url2, this.model, 2, this.utili).then(
             data => {
               this.servicedata.setCommande(null);
               this.router.navigate(['/']);
             },
             error => {
               console.log('Error', error);
             }
           );
         } else {
           this.servicedata.setCommande(this.model);
           this.router.navigate(['/signin']);
         }
       } else {
         if ((this.livreur.etat_compte == 2) && (this.model.type_cmd == true)) {
           this.errliv = 1;
           this.msgerr = 'veuillez choisir un autre livreur';
         }
       }


    } else {
      this.servicedata.setCommande(this.model);
      this.errliv = 1;
      this.msgerr = 'veuillez choisir un livreur';
    }
  }
  addLC(): void {
    this.arr[this.arr.length] = this.arr.length + 1;
    this.model.lignes[this.model.lignes.length] = {nom_prod: '', quantite: null, prix_prod: null};
    this.servicedata.setCommande(this.model);
    console.log(this.servicedata.getCommande());
  }
  deleteLC(id: any): void {
    /*var elem = document.getElementById(id);
    elem.remove();*/
    this.model.lignes.splice(id, 1);
    this.servicedata.setCommande(this.model);
    console.log(this.servicedata.getCommande());
  }


  changeLiv(): void {
    this.servicedata.setLivreur(null);
  }



}
export interface CommandeView {
  client_id: number;
  livreur_id: number;
  etat_cmd: number;
  lignes: LcView[];
  type_cmd: boolean;

}

export interface LcView {
  nom_prod: string;
  quantite: number;
  prix_prod: number;
}
