import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../Service/Data/data.service';
import {AuthentificationService} from '../../Service/Authentification/authentification.service';
import {HttpService} from '../../Service/Http/http.service';
import {ToastService} from '../../Service/Toast/toast.service';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {SocketService} from '../../Service/Socket/socket.service';
@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {
  errliv = 0;
  msgerr = '';
  utili = null;
  arr: any[] = [];
  model: CommandeView = null ;
  tmp: CommandeView = null;
  livreur: any = null;
  Commande = false;
  variable = [];
  private stompClient = null;

  constructor(private http: HttpService,
              private router: Router,
              private servicedata: DataService,
              private auth: AuthentificationService,
              private toast: ToastService ,
              private socketService: SocketService) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.utili = this.auth.getUser();
      this.model = {
        titre : '',
        client_id: this.auth.getUser().id,
        livreur_id: null,
        etat_cmd : 0,
        lignes: [],
        type_cmd: 0,
        total: 0
      };
    } else {
      this.model = {
        titre : '',
        client_id: null,
        livreur_id: null,
        etat_cmd : 0,
        lignes: [],
        type_cmd: 0,
        total: 0
      };
    }
    this.tmp = <CommandeView> this.servicedata.getCommande();
    this.livreur = this.servicedata.getLivreur();
    if (this.tmp === null) {
      this.model.lignes[this.model.lignes.length] = {nom_prod: '', quantite: null, prix_prod: null , sub_total: null};
      this.servicedata.setCommande(this.model);
    } else {
      this.model = this.tmp;
    }
  }



  envoyer(): void {
    const url2 = 'http://localhost:8080/app/cmd/create';
    this.msgerr = '';
    if (this.livreur) {
      if ((this.livreur.etat_compte === 1 ) ||
        (this.livreur.etat_compte === 0 ) ||
        ((this.livreur.etat_compte === 2) && (this.model.type_cmd === 0))) {
         if (this.auth.isLoggedIn() === true)  {
           if (this.Commande) {
             this.model.type_cmd = 1;
           } else {
             this.model.type_cmd = 0;
           }

           this.model.livreur_id = this.livreur.id;
           this.model.lignes.map(val => {
               val.sub_total =  val.quantite * val.prix_prod;
               this.model.total = this.model.total +  val.sub_total;
              });
          if ( this.etat_compte() === true ) {
            this.http.postHttp(url2, this.model, 2, this.utili).then(
              data => {
                this.socketService.send('/service/newCommande', data);
              },
              error => {
                console.log('Error #### ', error);
              }
            );
          } else {
            this.toast.CreateToast('warning', 'Commande annuler', 'Merci de remplir les informations de votre profile');
            this.servicedata.setCommande(this.model);
            this.router.navigate(['/profile']);
          }

         } else {
           this.servicedata.setCommande(this.model);
           this.router.navigate(['/signin']);
         }
       } else {
         if ((this.livreur.etat_compte === 2) && (this.model.type_cmd === 1)) {
           this.errliv = 1;
           this.msgerr = 'veuillez choisir un autre livreur';
           this.toast.CreateToast('warning', 'Livreur non disponible', 'Choisir un autre livreur pour effectuer une commande expresse');

         }
       }


    } else {
      this.servicedata.setCommande(this.model);
      this.errliv = 1;
      this.msgerr = 'veuillez choisir un livreur';
      this.toast.CreateToast('warning', 'Warning' , 'Veuillez choisir un livreur');
    }
  }
  addLC(): void {
    this.arr[this.arr.length] = this.arr.length + 1;
    this.model.lignes[ this.model.lignes.length ] = {nom_prod: '', quantite: null, prix_prod: null , sub_total: null};
    this.servicedata.setCommande(this.model);
  }
  deleteLC(id: any): void {
    this.model.lignes.splice(id, 1);
    this.servicedata.setCommande(this.model);
  }


  changeLiv(): void {
    this.servicedata.setLivreur(null);
  }

  etat_compte() {
    let  etat;
    let sum = 0 , div = 0;
    if ( this.utili.type === 1) {
      div = 3;
    }
    if (this.utili.nom !== '') {
      sum += 1;

    }
    if (this.utili.prenom !== '') {
      sum += 1;

    }
    if ( this.utili.type === 1 && this.utili.adress !== '') {
      sum += 1;

    }

    etat = sum / div ;
    etat = etat.toFixed(2);

    return etat === 1 ? true : false ;
  }
}
export interface CommandeView {
  titre: string;
  client_id: number;
  livreur_id: number;
  etat_cmd: number;
  lignes: LcView[];
  type_cmd: number;
  total: number;
}

export interface LcView {
  nom_prod: string;
  quantite: number;
  prix_prod: number;
  sub_total: number;
}
