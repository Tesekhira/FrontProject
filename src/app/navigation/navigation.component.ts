import {Component, OnInit, OnChanges, SimpleChanges, SimpleChange, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit,OnChanges {
  @Input()
  utili:Object=null;
  constructor(private router: Router) { }

  ngOnInit() {
    this.utili=JSON.parse(localStorage.getItem("utilisateur"));
  }
  LogOut():void{
    localStorage.removeItem("utilisateur");
    this.router.navigate(['/']);
    //location.reload();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    const utili: SimpleChange = changes.utili;
    console.log('prev value: ', utili.previousValue);
    console.log('got name: ', utili.currentValue);
    this.utili = utili.currentValue;
  }
}
