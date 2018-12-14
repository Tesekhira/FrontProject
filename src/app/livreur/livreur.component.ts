import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-livreur',
  templateUrl: './livreur.component.html',
  styleUrls: ['./livreur.component.scss']
})
export class LivreurComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  livreurs= [];
  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.chargerLivreur();
  }
  chargerLivreur():void{
    let url = "http://localhost:8080/app/livreur/all";
    this.http.get(url,this.httpOptions).subscribe(
      data => {
        console.log(data);
        this.livreurs=<any[]>data;
      },
      error => {
        console.log("Error", error);
      }
    );
  }
}
