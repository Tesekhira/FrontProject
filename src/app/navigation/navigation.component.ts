import {Component, OnInit, OnChanges, SimpleChanges, SimpleChange, Input} from '@angular/core';
import {Router} from "@angular/router";
import {AuthentificationService} from "../Authentification/authentification.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input()
  utili:Object=null;
  constructor(private router: Router,public auth:AuthentificationService) { }

  ngOnInit() {
    this.utili=this.auth.getUser();
  }
  LogOut():void{
    this.auth.Logout();
    this.router.navigate(['/']);
  }

}
