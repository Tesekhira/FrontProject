import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthentificationService} from '../../Service/Authentification/authentification.service';
import {HttpService} from '../../Service/Http/http.service';
import {ToastService} from '../../Service/Toast/toast.service';
import {MatDialog} from '@angular/material';
import {ModalComponent} from '../modal/modal.component';
import {SocketService} from '../../Service/Socket/socket.service';
import {__await} from 'tslib';
import {DataService} from '../../Service/Data/data.service';
import {AcceptComponent} from '../accept/accept.component';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

   model: UserView = {
     id: null,
     email: '',
     password: '',
     token: '',
     nom: '',
     prenom: '',
     adress: '',
     date: null,
     path_img: '',
     type: null,
     recommander: [],
     recommandation: [],
     signales: [],
     commandes: [],
     listeSignale: new Array<any>(),
     truePass: '',
     mypass: '',
     nvPass: '',
     nv2Pass: '',
     nbSignale: null
   };
   formEdit: UserView = {
     id: null,
     nom: '',
     prenom: '',
     adress: '',
     email: '',
     password: '',
     token: '',
     date: null,
     path_img: '',
     type: null,
     recommander: [],
     recommandation: [],
     signales: [],
     commandes: [],
     listeSignale: new Array<any>(),
     truePass: '',
     mypass: '',
     nvPass: '',
     nv2Pass: '',
     nbSignale: null
   };
   utili = null;
   passwordError = 0;
   TypeCompte = 1;
   emailError = 0;
   password = '';
   DisplayRecommande = false ;
    DisplayFormSignale = false;
    selectedValue = '';
    tableId = new Array<Number>();
    tableIdRecom =  [];
    moin = 0;
    plus = 0;
    sign = 0;
  listeRecommande = [];

  constructor(public auth: AuthentificationService, public http: HttpService,
              private router: Router, public dialog: MatDialog,
              private toast: ToastService, private socketservice: SocketService, private servicedata: DataService) {
    if (this.auth.isLoggedIn()) {
      this.utili = this.auth.getUser();
      this.TypeCompte = this.utili.type;
    }
  }

  ngOnInit() {
   this.init();
   if (this.model.type === 2) {
     this.recomliv(this.model.recommandation);

   } else if (this.model.type === 1) {
     this.recomCli(this.model.recommander);
   }
    this.nbSignal(this.model.signales);
  }
  init() {
    if (this.auth.isLoggedIn()) {
      this.utili = this.auth.getUser();
    }

      if (this.utili !== null) {
        if (this.utili.id) {
          this.formEdit.id = this.model.id = this.utili.id;
        }
        if (this.utili.email) {
          this.formEdit.email = this.model.email = this.utili.email;
        }
        if (this.utili.password) {
          this.formEdit.password = this.model.password = this.utili.password;
        }
        if (this.utili.token) {
          this.formEdit.token = this.model.token = this.utili.token;
        }
        if (this.utili.nom) {
          this.formEdit.nom = this.model.nom = this.utili.nom;
        }
        if (this.utili.prenom) {
          this.formEdit.prenom = this.model.prenom = this.utili.prenom;
        }
        if (this.utili.date) {
          this.formEdit.date = this.model.date = this.utili.date.substring(0, 10);
        }

        if (this.utili.type) {
          this.formEdit.type = this.model.type = this.utili.type;
        }

        if (this.model.type  ===   1 && this.utili.adress) {
          this.formEdit.adress = this.model.adress = this.utili.adress;
        }

        if (this.model.type  ===   1 && this.utili.nbSignale) {
          this.formEdit.nbSignale = this.model.nbSignale = this.utili.nbSignale;
        }
        if (this.model.type ===  2 && this.utili.path_img) {
          this.formEdit.path_img = this.model.path_img = this.utili.path_img;
        }
        if (this.utili.commandes != null) {
          this.formEdit.commandes = this.model.commandes = this.utili.commandes;
        }
        if (this.model.type === 1 && this.utili.recommander != null) {
          this.formEdit.recommander = this.model.recommander = this.utili.recommander;
        }

        if (this.model.type === 2 && this.utili.recommandation != null) {
          this.formEdit.recommandation = this.model.recommandation = this.utili.recommandation;
        }

        if ( ( this.model.type === 2 || this.model.type === 1 )  && this.utili.signales != null) {
          this.formEdit.signales = this.model.signales = this.utili.signales;
        }

        this.formEdit.truePass = this.model.truePass = this.auth.getPass();

        if (this.model.type === 2 && this.model.signales !== null && this.model.signales.length !== 0 ) {
            this.ChargerClientSignaler(this.model.signales);
          }
        if (this.model.type === 1 && this.model.commandes.length !== 0) {
          this.chargerLivreurName(this.model.commandes);
        } else if (this.model.type === 2 && this.model.commandes.length !== 0) {
          this.chargerClientName(this.model.commandes);
        }
        if (this.model.type === 1 ) {
          this.ChargerLivreurArecommander(this.model.recommander);
        }
      }
  }
  LogOut(): void {
    this.auth.Logout();
    this.router.navigate(['/signin']);
  }
  chargerLivreurName(table: any) {
    const url = 'http://localhost:8080/app/livreur';

    for (let i = 0; i < table.length; i++) {
      const newUrl = url + '/' + table[i].livreur_id;
      this.http.getHttp(newUrl, 1, null).then(
        result => {
          if (result !== null) {
            table[i].livreur = result;
            if ( table[i].etat_cmd > 0 ) {
              if (this.isInArrayRecom(table[i].livreur_id) === false ) {
                this.tableIdRecom.push(table[i].livreur_id);
                this.listeRecommande.push(table[i].livreur);
              }
            }
            table[i].comition = (table[i].total * 0.10).toFixed(2);
            switch (table[i].etat_cmd) {
              case 0:
                table[i].classe = 'partime';
                break;
              case 1 :
                table[i].classe = 'freelance';
                break;
              case 2:
                table[i].classe = 'fulltime';
                break;
              case 3:
                table[i].classe = 'succes';
                break;

            }

          }

        }, err => {

        }).then(() => {
      });
    }

  }
  isInArray(value) {
    return this.tableId.indexOf(value) > -1;
  }
  isInArrayRecom(value) {
    return this.tableIdRecom.indexOf(value) > -1;
  }
  chargerClientName(table: any) {

    const url = 'http://localhost:8080/app/client';
    for (let i = 0; i < table.length; i++) {
      const newUrl = url + '/' + table[i].client_id;
      this.http.getHttp(newUrl, 1, null).then(
        result => {
          if (result !== null) {
            table[i].client = result;
            table[i].comition = (table[i].total * 0.10).toFixed(2);
            if (this.isInArray(table[i].client.id) === false ) {
              this.tableId.push(table[i].client.id);
              this.model.listeSignale.push(table[i].client);
            }

            switch (table[i].etat_cmd) {
              case 0:
                table[i].classe = 'partime';
                break;
              case 1 :
                table[i].classe = 'freelance';
                  break;
              case 2:
                table[i].classe = 'fulltime';
                break;
              case 3:
                table[i].classe = 'succes';
                break;

            }
          }

        }, err => {

        });

    }
  }

  ChargerLivreurArecommander(table: any) {
    const url = 'http://localhost:8080/app/livreur';
    for (let i = 0; i < table.length; i++) {
      const newUrl = url + '/' + table[i].livreur_id;
      this.http.getHttp(newUrl, 1, null).then(
        result => {
          if (result !== null) {
            table[i].livreur = result;
            if (this.isInArrayRecom(table[i].livreur.id) === false ) {
              this.tableIdRecom.push(table[i].livreur.id);
            }
            switch (table[i].etat) {
              case 0:
                table[i].classe = 'vide';
                break;
              case 1:
                table[i].classe = 'succes';
                break;

              case -1:
                table[i].classe = 'partime';
                break;
            }
          }
        }, err => {

        });
    }
  }
  ChargerLivreurNewRecommander(val: any) {
    const url = 'http://localhost:8080/app/livreur';
      const newUrl = url + '/' + val.livreur_id;
      this.http.getHttp(newUrl, 1, null).then(
        result => {
          if (result !== null) {
            val.livreur = result;
            if (this.isInArrayRecom(val.livreur.id) === false ) {
              this.tableIdRecom.push(val.livreur.id);
            }
            switch (val.etat) {
              case 0:
                val.classe = 'vide';
                break;
              case 1:
                val.classe = 'succes';
                break;
              case -1:
                val.classe = 'partime';
                break;
            }
          }
        }, err => {

        }).then( () => {
        this.model.recommander[this.model.recommander.length] = val;
      });

  }
  ChargerClientSignaler(table: any) {
    const url = 'http://localhost:8080/app/client';
    for (let i = 0; i < table.length; i++) {
      const newUrl = url + '/' + table[i].client_id;
      this.http.getHttp(newUrl, 1, null).then(
        result => {
          if (result !== null) {
            table[i].client = result;
            if (this.isInArray(table[i].client.id) === false ) {
              this.tableId.push(table[i].client.id);
            }
            if (table[i].etat_signale) {
              table[i].class = 'freelance';
            } else {
              table[i].class = 'partime';
            }
          }

        }, err => {

        });
    }
  }
  ResetEditForm(): void {
    if (this.utili.id) {
      this.formEdit.id = this.model.id = this.utili.id;
    }
    if (this.utili.email) {
      this.formEdit.email = this.model.email = this.utili.email;
    }
    if (this.utili.password) {
      this.formEdit.password = this.model.password = this.utili.password;
    }
    if (this.utili.token) {
      this.formEdit.token = this.model.token = this.utili.token;
    }
    if (this.utili.nom) {
      this.formEdit.nom = this.model.nom = this.utili.nom;
    }
    if (this.utili.prenom) {
      this.formEdit.prenom = this.model.prenom = this.utili.prenom;
    }
    if (this.utili.date) {
      this.formEdit.date = this.model.date = this.utili.date.substring(0, 10);
    }

    if (this.utili.type) {
      this.formEdit.type = this.model.type = this.utili.type;
    }

    if (this.model.type ===  1 && this.utili.adress) {
      this.formEdit.adress = this.model.adress = this.utili.adress;
    }

    if (this.model.type ===  2 && this.utili.path_img) {
      this.formEdit.path_img = this.model.path_img = this.utili.path_img;
    }

    if (this.model.type ===  2 && this.utili.signales) {
      this.formEdit.signales = this.model.signales = this.utili.signales;
    }

    this.passwordError = 0;
    this.emailError = 0;
    this.password = '';
  }

  SauvgarderEditForm(): void {

    const url = 'http://localhost:8080/app/client/update';
    const url2 = 'http://localhost:8080/app/livreur/update';
    if (this.auth.validateEmail(this.formEdit.email)) {
      if (this.model.type ===  1) {
        this.openDialog().then(result => {
              this.password = result;
          }).then(() => {
            if (this.password === this.auth.getPass()) {
                this.http.patchHttp(url, this.formEdit, 2, this.utili).then(
                  res => {
                    if (res !== null) {
                      /*const token = this.utili.token;
                      this.utili = res;
                      this.utili.token = token;
                      this.auth.setUser(this.utili);*/
                      this.socketservice.send('/service/updateCli', res);
                      (async () => {
                        // Do something before delay
                        console.log('before delay')

                        await this.socketservice.delay(200);

                        // Do something after
                        console.log('after delay')
                        this.init();
                        this.toast.CreateToast('success', 'Modification effectuée', 'Votre modification est enregistrer');
                      })();
                    } else {
                      this.emailError = 2;
                    }
                  },
                  error => {

                  }
                );
            } else if (this.password === undefined) {
              this.ResetEditForm();
              this.toast.CreateToast('warning', 'Modification', 'Votre modification est annuler');
            } else {

              this.ResetEditForm();
              this.toast.CreateToast('error', 'Modification annuler', ' Votre mot de passe est incorrect ');
            }

        });
      } else if (this.model.type ===  2) {
        this.openDialog().then(result => {
          this.password = result;
        }).then(() => {
          if (this.password === this.auth.getPass()) {
            this.http.patchHttp(url2, this.formEdit, 2, this.utili).then(
              res => {
                if (res !== null) {
                 /* const token = this.utili.token;
                  this.utili = res;
                  this.utili.token = token;
                  this.auth.setUser(this.utili);*/
                  this.socketservice.send('/service/updateLiv', res);
                  (async () => {
                    // Do something before delay
                    console.log('before delay')

                    await this.socketservice.delay(200);

                    // Do something after
                    console.log('after delay')
                    this.init();
                    this.toast.CreateToast('success', 'Modification effectuée', 'Votre modification est enregistrer');
                  })();
                } else {
                  this.emailError = 2;
                }
              },
              error => {

              }
            );
          } else if (this.password === undefined) {
            this.ResetEditForm();
            this.toast.CreateToast('warning', 'Modification', 'Votre modification est annuler');
          } else {

            this.ResetEditForm();
            this.toast.CreateToast('error', 'Modification annuler', ' Votre mot de passe est incorrect ');
          }

        });
      }
    } else {
      this.emailError = 1;
    }

  }
  SauvgarderCompteEdit() {
    const url = 'http://localhost:8080/app/client/CompteUpdate';
    const url2 = 'http://localhost:8080/app/livreur/CompteUpdate';
    if (this.formEdit.mypass  ===   this.auth.getPass()) {
      if (this.formEdit.nv2Pass  ===   this.formEdit.nvPass) {
        if (this.formEdit.nvPass !== this.auth.getPass()) {
          if (this.model.type ===  1) {
            this.formEdit.password = this.formEdit.nvPass;
            this.http.patchHttp(url, this.formEdit, 2, this.utili).then(
              res => {
                this.passwordError = 0;
                this.toast.CreateToast('success', 'Modification effectuée', 'Votre mot de passe est changé');
                this.LogOut();
              },
              error => {

              }
            );
          } else if (this.model.type  ===   2) {
            this.formEdit.password = this.formEdit.nvPass;
            this.http.patchHttp(url2, this.formEdit, 2, this.utili).then(
              res => {
                this.passwordError = 0;
                this.toast.CreateToast('success', 'Modification effectuée', 'Votre mot de passe est changé');
                this.LogOut();
              },
              error => {

              }
            );
          }
        } else {
          this.toast.CreateToast('warning', 'Mot de passe', 'Le nouveau mot de passe saisie est le même que l\'ancien');
        }
      } else {
        this.passwordError = 1;
      }
    } else {
      this.passwordError = 2;
    }

  }
  openDialog() {
    this.password = '';
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '430px',
      data: {password: this.password}
    });

    return dialogRef.afterClosed().toPromise();
  }
  ChangeRecom(rec, val) {
    const url = 'http://localhost:8080/app/recommander/update';
    rec.etat = val;
    switch (rec.etat) {
      case 0:
        rec.classe = 'vide';
        break;
      case 1:
        rec.classe = 'succes';
        break;

      case -1:
        rec.classe = 'partime';
        break;
    }
    this.http.patchHttp(url, rec, 2, this.auth.getUser()).then(
      res => {
                  rec = res;
      }, err => {

      }
    );

  }
  Signaler(sig) {
    const url = 'http://localhost:8080/app/signale/update';
      sig.etat_signale = !sig.etat_signale;
      if (sig.etat_signale) {
        sig.class = 'freelance';
      } else {
        sig.class = 'partime';
      }
    this.http.patchHttp(url, sig, 2, this.auth.getUser()).then(
      res => {
              sig = res ;
      }, err => {

      }
    );
  }
  getClientSelected(id_client) {
    for ( let i = 0 ; i < this.model.listeSignale.length ; i++) {
      if ( this.model.listeSignale[i].id === id_client ) {
        return this.model.listeSignale[i];
      }
    }
    return null;
  }
  AddSignaler(id_client) {
    const url = 'http://localhost:8080/app/signale/create';
    const url2 = 'http://localhost:8080/app/livreur/' + this.utili.id;
    const url3 = 'http://localhost:8080/app/client/update' ;
    const id = id_client;
    this.DisplayFormSignale  === true ? this.DisplayFormSignale = false : this.DisplayFormSignale = true;
    const variable = { 'livreur_id' : this.utili.id , 'etat_signale' : true , 'client_id' : id };
    console.log('voici id ' + variable.client_id);

    const client = this.getClientSelected(id_client);
    this.http.postHttp(url, variable, 2, this.utili).then(
      res => {
                  const val = res;
              }, error => {

        console.log(error);
      }
    ).then( () => {
        this.http.getHttp(url2, 1, null).then(
          result => {
            if (result !== null) {
              this.auth.LogIn({email : this.utili.email , password : this.auth.getPass()}).then(
                res => {
                  this.model.listeSignale.splice(this.model.listeSignale.indexOf(client), 1);
                  this.init();
                });
            }
          }, err => {
            console.log(err);
          });
    });
  }

  recomliv(tab): void {
      let  j;
      this.moin = 0;
      this.plus = 0;
      for (j = 0; j < tab.length; j++) {
        if (tab[j].etat === false) {
          this.moin += 1;
        } else {
          this.plus += 1;        }
      }

  }
  recomCli(tab): void {

      let j;
      this.moin = 0;
      this.plus = 0;
      for (j = 0; j < tab.length; j++) {
        if (tab[j].etat === false) {
          this.moin += 1;
        } else {
          this.plus += 1;        }
      }

  }
  nbSignal(tab) {
    for ( let i = 0 ; i < tab.length ; i++) {
      if ( tab[i].etat_signale === true ) {
        this.sign += 1;
      }
    }
  }
  etat_compte() {
      let  etat;
      let sum = 0 , div = 0;
      if ( this.model.type === 1) {
        div = 3;
      } else {
        div = 2;
      }
      if (this.model.nom !== '') {
        sum += 1;

      }
      if (this.model.prenom !== '') {
        sum += 1;

      }
      if ( this.model.type === 1 && this.model.adress !== '') {
        sum += 1;

      }

        etat = sum / div ;
        etat = etat.toFixed(2) * 100;


      return etat + ' %';
  }
  ShowFormSignal() {
    if (this.model.listeSignale.length > 0 ) {
      this.DisplayFormSignale  === true ? this.DisplayFormSignale = false : this.DisplayFormSignale = true;
    } else {
      this.toast.CreateToast('warning', 'Signalisation', 'la liste des clients est vide');
    }
  }
  ShowFormRecommandation() {

    this.DisplayRecommande  === true ? this.DisplayRecommande = false : this.DisplayRecommande = true;

  }
  AddRecommander(liv, id_liv) {
    const url = 'http://localhost:8080/app/recommander/create';
    const url2 = 'http://localhost:8080/app/livreur/' + this.utili.id;
    console.log(id_liv);
    if ( id_liv !== undefined) {
      this.DisplayRecommande  === true ? this.DisplayRecommande = false : this.DisplayRecommande = true;

      this.http.postHttp(url, {client_id : this.utili.id , livreur_id : id_liv , etat : 0}, 2, this.utili).then(
        res => {
          const val: any  = res;
          this.listeRecommande.splice(this.listeRecommande.indexOf(liv), 1);
          this.ChargerLivreurNewRecommander(val);
        }, error => {

          console.log(error);
        }
      );
    } else {
      this.toast.CreateToast('warning', 'Recommandation', 'la liste des Livreur est vide');
    }
  }

  openDialogAcc(cmd) {
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
  openDialogComm(cmd) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '680px',
      data: cmd
    });
    this.utili = this.auth.getUser();
    const prom = dialogRef.afterClosed().toPromise();
    prom.then(() => {
      this.servicedata.setNotif( this.auth.getNbNotification());
    });
  }
  changeStateCmd(cmd) {
    switch (cmd.etat_cmd) {
      case 0: if (this.auth.getTypeCompte() === 2) {
                this.openDialogAcc(cmd);
              }
              break;
      case 1: if (this.auth.getTypeCompte() === 2) {
                this.openDialogComm(cmd);
              }
        break;
      case 2: if (this.auth.getTypeCompte() === 1) {
                this.openDialogComm(cmd);
              }
              break;
      case 4: if (this.auth.getTypeCompte() === 1) {
                console.log('qsdfghjklm======================qsdfghjklm');
                this.servicedata.setCommande(cmd);
                this.router.navigate(['/livreur']);
              }
              break;
    }
  }

}
export interface UserView {
  id: Number;
  email: string;
  password: string;
  token: string;
  nom: string;
  prenom: string;
  date: Date;
  adress: string;
  path_img: string;
  type: Number;
  commandes: [];
  recommander: any[];
  recommandation: [];
  signales: Array<any>;
  truePass: string;
  mypass: string;
  nvPass: string;
  nv2Pass: string;
  listeSignale: Array<any>;
  nbSignale: Number;
}


