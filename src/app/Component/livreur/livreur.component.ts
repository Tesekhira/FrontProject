import { Component, OnInit } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {DataService} from '../../Service/Data/data.service';
import {HttpService} from '../../Service/Http/http.service';
import {AuthentificationService} from '../../Service/Authentification/authentification.service';
import {ToastService} from '../../Service/Toast/toast.service';


@Component({
  selector: 'app-livreur',
  templateUrl: './livreur.component.html',
  styleUrls: ['./livreur.component.scss']
})
export class LivreurComponent implements OnInit {

  livreurs = null;
  all = null;
  fixall = null;
  moin = [];
  plus = [];
  input = '';
  constructor(public http: HttpService, private router: Router, private Send: DataService, private auth: AuthentificationService, private toast: ToastService) { }

  ngOnInit() {
    this.chargerLivreur();
    // console.log(this.ListLivreur);
  }

  onSelect(liv) {
    if (liv.etat_compte !== -1  ) {
      // console.log(liv.etat_compte);
      this.Send.setLivreur(liv);
      this.router.navigate(['commande']);
    } else if (liv.etat_compte === -1) {
      this.toast.CreateToast('warning', 'Livreur non disponible', 'Choisir un autre livreur');
    }
  }


  chargerLivreur(): void {
    const url = 'http://localhost:8080/app/livreur/all';
    this.http.getHttp(url, 1, null).then(
      data => {
        this.all = data;
        this.fixall =  data;
        this.livreurs = data;
        this.recomliv();
        this.trierLivreursparrecom();
      }, err => {
        console.log('Error', err);
      }
    );

  }

  recomliv(): void {
    this.moin = [];
    this.plus = [];
    let i, j;
     for (i = 0; i < this.livreurs.length; i++) {
       this.moin[i] = 0;
       this.plus[i] = 0;
      for (j = 0; j < this.livreurs[i].recommandation.length; j++) {
        if (this.livreurs[i].recommandation[j].etat === false) {
          this.moin[this.moin.length - 1] += 1;
        } else {
          this.plus[this.plus.length - 1] += 1;        }
      }
    }
  }
  trierLivreursparrecom(): void {
    let i, j, a, b;
    let tmp;
    for (i = 1; i < this.livreurs.length; i++) {
      for (j = i; j > 0; j--) {
        a = this.plus[j] - this.moin[j];
        b = this.plus[j - 1] - this.moin[j - 1];
        console.log( a + '   ' + b);
        if (a > b) {
          tmp = this.livreurs[j];
          this.livreurs[j] = this.livreurs[j - 1];
          this.livreurs[j - 1] = tmp;
          tmp = this.moin[j];
          this.moin[j] = this.moin[j - 1];
          this.moin[j - 1] = tmp;
          tmp = this.plus[j];
          this.plus[j] = this.plus[j - 1];
          this.plus[j - 1] = tmp;
        }
      }
    }
  }
  myFunction() {
    let i;
    this.livreurs = [];
    if (this.input !== '') {
      for (i = 0; i < this.all.length; i++) {
        if ((this.all[i].nom.toUpperCase().indexOf(this.input.toUpperCase()) > -1) ||
          (this.all[i].prenom.toUpperCase().indexOf(this.input.toUpperCase()) > -1) ||
          (this.all[i].email.toUpperCase().indexOf(this.input.toUpperCase()) > -1)) {
          this.livreurs[this.livreurs.length] = this.all[i];
        }

      }
    } else {
      this.livreurs = this.all;
    }
    this.recomliv();
    this.trierLivreursparrecom();
  }
  afficher(val): void {
    let i;
    this.livreurs = [];
    for (i = 0; i < this.all.length; i++) {
      if (this.all[i].etat_compte === val) {
        this.livreurs[this.livreurs.length] = this.all[i];
      }
    }
    this.recomliv();
    this.trierLivreursparrecom();
  }

  reset() {
    this.all = this.fixall;
    this.livreurs = this.fixall;
    this.input = '';
    this.recomliv();
    this.trierLivreursparrecom();
  }
}

