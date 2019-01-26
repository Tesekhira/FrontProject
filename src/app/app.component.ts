import { Component , OnInit} from '@angular/core';
import './Component/modal/modal.component.scss';

import {DataService} from './Service/Data/data.service';
import {AuthentificationService} from './Service/Authentification/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tesekhiraFront';

  constructor(private auth: AuthentificationService) { }

  ngOnInit() {
   this.auth.chargerTous();
  }
}
