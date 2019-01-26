import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {AuthentificationService} from '../Authentification/authentification.service';
import {ToastService} from '../Toast/toast.service';
import {DataService} from '../Data/data.service';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private stompClient = null;
  private socket = new SockJS('http://localhost:8080/app');

  // private auth: AuthentificationService = new AuthentificationService();
  constructor( private toast: ToastService, private servicedata: DataService) { }
  connect() {
    if (this.stompClient === null) {
      this.stompClient = Stomp.over(this.socket);

      const _this = this;
      this.stompClient.connect({}, function (frame) {
        _this.stompClient.subscribe('/socket/commande', function (cmd) {
          const cmdL = JSON.parse(cmd.body);
         // console.log('################## Strat service commande ');
          // console.log(cmdL);
          _this.addcmd(cmdL);
         // console.log('################## End service commande');
        });

        _this.stompClient.subscribe('/socket/test', function (cmd) {
          // const cmdL = JSON.parse(cmd.body);
          console.log('Strat service ');
          console.log(cmd.body);
          console.log('End service ');
        });

        _this.stompClient.subscribe('/socket/profileClient', function (cmd) {
          const cmdL = JSON.parse(cmd.body);
         // console.log('################## Strat service commande ');
          // console.log(cmdL);
          // console.log('voiaaaaaaaaaaaala');
          // console.log(cmd);
          _this.updateprofile(cmdL);
        //  console.log('################## End service commande');
        });

        _this.stompClient.subscribe('/socket/profileLivreur', function (cmd) {
          const cmdL = JSON.parse(cmd.body);
         // console.log('################## Strat service commande ');

          _this.updateprofile(cmdL);
         // console.log('################## End service commande');
        });


        _this.stompClient.subscribe('/socket/EtatCommande', function (cmd) {
          const cmdL = JSON.parse(cmd.body);
        //  console.log('################## Strat service commande ');

          _this.updateEtatCommande(cmdL);
       //   console.log('################## End service commande');
        });
      });
    }

  }
  // '/client/hello'
  send(url, data) {
    this.stompClient.send(
      url,
      {} , JSON.stringify(data)  );
  }

  addcmd(elem) {
    let utili = null;
    utili = JSON.parse(localStorage.getItem('utilisateur'));
    if ((utili.id === elem.client_id && utili.type === 1) || (utili.id === elem.livreur_id && utili.type === 2)) {
      utili.commandes.push(elem);
      localStorage.setItem('utilisateur', JSON.stringify(utili));
      this.servicedata.setCommandes(utili.commandes);
      if (utili.type === 2) {
        this.toast.CreateToast('success' , elem.titre , 'Une nouvelle commande arriver' );
      }
    }
  }
  updateprofile(usr) {
    let utili = null;
    utili = JSON.parse(localStorage.getItem('utilisateur'));
    if (utili.id === usr.id) {
      const token = utili.token;
      utili = usr;
      utili.token = token;
      // console.log(utili);
      localStorage.setItem('utilisateur', JSON.stringify(utili));
    }
  }
  updateEtatCommande(elem) {
    let utili = null;
    utili = JSON.parse(localStorage.getItem('utilisateur'));
    if ((utili.id === elem.client_id && utili.type === 1) || (utili.id === elem.livreur_id && utili.type === 2)) {
      // utili.commandes.push(elem);
      utili.commandes.map(val => {
        if (val.id === elem.id) {
          val.etat_cmd = elem.etat_cmd;
        }
      });
      localStorage.setItem('utilisateur', JSON.stringify(utili));
      this.servicedata.setCommandes(utili.commandes);
      if (utili.type === 1) {
        switch (elem.etat_cmd) {
          case 1 :
            this.toast.CreateToast('success' , elem.titre , 'votre commande a été accepter' );
            break;
          case 2 :
                if (elem.type_cmd === 0) {
                  this.toast.CreateToast('info' , elem.titre , 'votre commande est encours de traitement par le livreur' );
                } else if ( elem.type_cmd === 1 ) {
                  this.toast.CreateToast('info' , elem.titre , 'votre commande express est encours de traitement par le livreur' );
                }
            break;
          case 3:
            this.toast.CreateToast('success' , elem.titre , 'votre commande a été livrer' );
            break;
          case 4:
            this.toast.CreateToast('error' , elem.titre , 'Le Livreur n\'pas accepté votre commande' );
            break;
        }
      } else if (elem.etat_cmd === 3) {
        this.toast.CreateToast('success' , elem.titre , 'Le client a approver que la commande est bien livré' );

      }
    }
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
