import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ErrorComponent} from "./error/error.component";
import {AccueilComponent} from "./accueil/accueil.component";
import {ProfileComponent} from "./profile/profile.component";
import {CommandeComponent} from "./commande/commande.component";
import {Observable} from "rxjs";
import {LivreurComponent} from "./livreur/livreur.component";

class UserToken {
  token:string;
}
class Permissions {
  canActivate(user: UserToken): boolean {
    const utili=JSON.parse(localStorage.getItem("utilisateur"));

    if(utili!=null && utili.token != null)
       return true;
    return false;
  }
}

@Injectable()
class CanActivateTeam implements CanActivate {
  constructor(private permissions: Permissions, private currentUser: UserToken) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.permissions.canActivate(this.currentUser);
  }
}


const routes: Routes = [
  {
    path:"",
    component:AccueilComponent
  },
  {
    path:"signin",
    component:SignInComponent
  },
  {
    path:"signup",
    component:SignUpComponent
  },
  {
    path:"commande",
    component:CommandeComponent
    //,canActivate: [CanActivateTeam]
  },
  {
    path:"livreur",
    component:LivreurComponent
  },
  {
    path:"profile",
    component:ProfileComponent
  },
  {
    path:"**",
    component:ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[CanActivateTeam, UserToken, Permissions]
})
export class AppRoutingModule { }
