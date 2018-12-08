import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
   utili=JSON.parse(localStorage.getItem("utilisateur"));
   model:ClientView;
   modelLiv:LivreurView;
  constructor(private router: Router) { }

  ngOnInit() {
    switch (this.utili.type) {
      case 1:
        this.model={
          email:this.utili.email,
          password:this.utili.password,
          token:this.utili.token,
          nom:this.utili.nom,
          prenom:this.utili.prenom,
          adresse:this.utili.adresse,
          date:this.utili.date.substring(0,10)
        };
        break;
      case 2:
          this.modelLiv={
            email:this.utili.email,
            password:this.utili.password,
            token:this.utili.token,
            nom:this.utili.nom,
            prenom:this.utili.prenom,
            date:this.utili.date.substring(0,10),
            path_img:this.utili.path_img
          }
        break;

    }
  }
  LogOut():void{
    localStorage.removeItem("utilisateur");
    this.router.navigate(['/signin']);
  }
}
export interface ClientView{
  email:string;
  password:string;
  token:string;
  nom:string;
  prenom:string;
  date:Date;
  adresse:string;
}

export interface LivreurView{
  email:string;
  password:string;
  token:string;
  nom:string;
  prenom:string;
  date:Date;
  path_img:string;
}
