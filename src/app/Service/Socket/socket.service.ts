import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {AuthentificationService} from '../Authentification/authentification.service';
import {ToastService} from '../Toast/toast.service';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private stompClient = null;
 // private auth: AuthentificationService = new AuthentificationService();
  constructor( private toast: ToastService ) { }
  connect() {
    const socket = new SockJS('http://localhost:8080/app');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe('/socket/commande', function (cmd) {
        const cmdL = JSON.parse(cmd.body);
        console.log('################## Strat service commande ');
        // console.log(cmdL);
        _this.addcmd(cmdL);
        console.log('################## End service commande');
      });

      _this.stompClient.subscribe('/socket/test', function (cmd) {
        // const cmdL = JSON.parse(cmd.body);
        console.log('Strat service ');
        console.log(cmd.body);
        console.log('End service ');
      });
    });
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
      if (utili.type === 2) {
        this.toast.CreateToast('success' , elem.titre , 'Une nouvelle commande arriver' );
      }
    }
  }
}
