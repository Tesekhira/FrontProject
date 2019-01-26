import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthentificationService} from '../../Service/Authentification/authentification.service';
import {HttpService} from '../../Service/Http/http.service';
import {DataService} from '../../Service/Data/data.service';
import {SocketService} from '../../Service/Socket/socket.service';
import {CommandeView} from '../accept/accept.component';
import {ToastService} from '../../Service/Toast/toast.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  cmd: CommandeView;
  utili = this.auth.getUser();
  etatActuel = '';
  etatSuivante = '';
  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CommandeView,
              public auth: AuthentificationService, public http: HttpService,
              private servicedata: DataService,
              private socketservice: SocketService,
              private toast: ToastService) { }

  ngOnInit() {
    this.cmd = this.data;
    switch (this.cmd.etat_cmd) {
      case 1: this.etatActuel = 'Accepter (en Attente)';
              this.etatSuivante = 'en cours';
              break;
      case 2: this.etatActuel = 'en cours';
              this.etatSuivante = 'Livrée';
              break;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  ChangeEtat(_etat): void {
    const url = 'http://localhost:8080/app/cmd/update';
    const url2 = 'http://localhost:8080/app/livreur/update';
    if (this.auth.isLoggedIn()) {
      if (_etat === true ) {
        if (this.utili.etat_compte === -1) {
          this.toast.CreateToast('warning' ,  this.cmd.titre, 'Vous ne pouvez as accepter cette commande tant que vous etes indisponible' );
          this.dialogRef.close();
          return;
        }
        this.cmd.etat_cmd += 1;
        console.log(this.cmd.etat_cmd);
        this.http.patchHttp(url, this.cmd, 2, this.utili).then(
          data => {
            this.socketservice.send('/service/ChangeEtat', data);
            },
          error => {
            console.log('Error #### ', error);
          }
        );
        if (this.cmd.etat_cmd === 2) {
          (async () => {
            await this.socketservice.delay(2000);
            this.utili = this.auth.getUser();
            console.log('fuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuck');
            console.log(this.utili);
            this.utili.etat_compte = -1;
            if (_etat === true) {
              this.http.patchHttp(url2, this.utili, 2, this.utili).then(
                data => {
                  this.socketservice.send('/service/updateLiv', data);
                },
                error => {
                  console.log('Error #### ', error);
                }
              );
            }
          })();
        }

      }
    }
    (async () => {
      await this.delay(500);
      this.dialogRef.close();
    })();
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
