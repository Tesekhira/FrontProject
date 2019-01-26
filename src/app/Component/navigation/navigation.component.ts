import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthentificationService} from '../../Service/Authentification/authentification.service';
import {AcceptComponent} from '../accept/accept.component';
import {MatDialog} from '@angular/material';
import {DataService} from '../../Service/Data/data.service';
import {HttpService} from '../../Service/Http/http.service';
import {SocketService} from '../../Service/Socket/socket.service';
import {ToastService} from '../../Service/Toast/toast.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {
  @Input()
  utili;
  constructor(private router: Router, public auth: AuthentificationService,
              public dialog: MatDialog, private servicedata: DataService,
              public http: HttpService, private socketservice: SocketService,
              private toast: ToastService) { }
  notifications ;
  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.utili = this.auth.getUser();
      this.notifications = this.auth.getNbNotification();
    }
  }
  LogOut(): void {
    this.auth.Logout();
    this.router.navigate(['/']);
  }
  openDialog(cmd) {
    const dialogRef = this.dialog.open(AcceptComponent, {
      width: '680px',
      data: cmd
    });
    this.utili = this.auth.getUser();
    const prom = dialogRef.afterClosed().toPromise();
    prom.then(() => {
      this.servicedata.setNotif( this.auth.getNbNotification());
    });
  }
  changeState(s) {
    const url = 'http://localhost:8080/app/livreur/update';
    if (this.auth.isLoggedIn()) {
      console.log(this.auth.getCmdEnCours());
      console.log(this.auth.getCmdEnCours().length);
      if ( s === 1 && this.auth.getCmdAccept().length > 0) {
        this.toast.CreateToast('error' , 'Action Refuser' , 'vous avez déjà des commande en attentes' );
      } else if (s === 0 && this.auth.getCmdEnCours().length > 0 ) {
        this.toast.CreateToast('error' , 'Action Refuser' , 'vous avez déjà des commande encours' );
      } else {
        this.utili = this.auth.getUser();
        this.utili.etat_compte = s;
        this.http.patchHttp(url, this.utili, 2, this.utili).then(
          data => {
            this.socketservice.send('/service/updateLiv', data);
            (async () => {
              await this.socketservice.delay(200);

              // Do something after
              this.servicedata.setNotif(this.auth.getNbNotification());
              this.servicedata.setUser(this.auth.getUser());
            })();
          },
          error => {
            console.log('Error #### ', error);
          }
        );
      }


    }
  }

}
