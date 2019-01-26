import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthentificationService} from '../../Service/Authentification/authentification.service';
import {HttpService} from '../../Service/Http/http.service';
import {DataService} from '../../Service/Data/data.service';
import {SocketService} from '../../Service/Socket/socket.service';
import {ToastService} from '../../Service/Toast/toast.service';

@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.scss']
})
export class AcceptComponent  implements OnInit {
  cmd: CommandeView;
  utili = this.auth.getUser();
  constructor(
    public dialogRef: MatDialogRef<AcceptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommandeView,
    public auth: AuthentificationService, public http: HttpService,
    private servicedata: DataService,
    private socketservice: SocketService,
    private toast: ToastService) {

  }
  ngOnInit(): void {
    this.cmd = this.data;
    console.log(this.cmd);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  AccepterCmd(_etat): void {
    const url = 'http://localhost:8080/app/cmd/update';
    const url2 = 'http://localhost:8080/app/livreur/update';
    let newEtatCmpt = this.utili.etat_compte;
    if (this.auth.isLoggedIn()) {
      if (_etat === true) {
        if (this.utili.etat_compte === -1) {
          this.toast.CreateToast('warning' ,  this.cmd.titre, 'Vous ne pouvez as accepter cette commande tant que vous etes indisponible' );
          this.dialogRef.close();
          return;
        }
        this.cmd.etat_cmd = 1;
        console.log('TESTTET');
        if (this.cmd.type_cmd === 1) {
          this.cmd.etat_cmd = 2;
          newEtatCmpt = this.utili.etat_compte = -1;
        } else {
          this.cmd.etat_cmd = 1;
          if (this.utili.etat_compte === 1) {
            newEtatCmpt = this.utili.etat_compte = 0;
          }
        }
    } else {
        this.cmd.etat_cmd = 4;
      }

      this.http.patchHttp(url, this.cmd, 2, this.utili).then(
        data => {
          this.socketservice.send('/service/ChangeEtat', data);
        },
        error => {
          console.log('Error #### ', error);
        }
      );
      (async () => {
        await this.socketservice.delay(500);
        this.servicedata.setNotif(this.auth.getNbNotification());
        this.servicedata.setUser(this.auth.getUser());
        this.utili = this.auth.getUser();
         this.utili.etat_compte = newEtatCmpt;
        if (_etat === true) {
          this.http.patchHttp(url2, this.utili, 2, this.utili).then(
            data => {
              this.socketservice.send('/service/updateLiv', data);
              (async () => {
                await this.socketservice.delay(500);
                this.servicedata.setNotif(this.auth.getNbNotification());
                this.servicedata.setUser(this.auth.getUser());
              })();
            },
            error => {
              console.log('Error #### ', error);
            }
          );
        }
      })();
    }
    (async () => {
      await this.socketservice.delay(500);
    this.dialogRef.close();
    })();
  }
 /* declinerCmd(): void {
    const url = 'http://localhost:8080/app/cmd/update';
    this.data.etat_cmd = 4;
    if (this.auth.isLoggedIn()) {
      if (this.data.type_cmd === 1)  {
        this.utili.etat_compte = -1;
        this.http.patchHttp(url, this.utili, 2, this.utili).then(
          data => {
            this.auth.LogIn({email : this.utili.email , password : this.auth.getPass()}).then(
              res => {
                this.servicedata.setNotif(this.auth.getNbNotification());
                this.servicedata.setUser(this.auth.getUser());
              },
              err => {}
            );
          },
          error => {
            console.log('Error #### ', error);
          }
        );
        this.data.etat_cmd = 2;
      }
      this.http.patchHttp(url, this.cmd, 2, this.utili).then(
        data => {
          this.auth.LogIn({email : this.utili.email , password : this.auth.getPass()}).then(
            res => {
              this.servicedata.setNotif(this.auth.getNbNotification());
              this.servicedata.setUser(this.auth.getUser());
            },
            err => {}
          );
        },
        error => {
          console.log('Error #### ', error);
        }
      );

    }
    this.dialogRef.close();
  }*/


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

