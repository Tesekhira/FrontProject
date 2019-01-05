import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {SignInComponent} from './Component/sign-in/sign-in.component';
import {SignUpComponent} from './Component/sign-up/sign-up.component';
import {ErrorComponent} from './Component/error/error.component';
import {AccueilComponent} from './Component/accueil/accueil.component';
import {ProfileComponent} from './Component/profile/profile.component';
import {CommandeComponent} from './Component/commande/commande.component';
import {Observable} from 'rxjs';
import {LivreurComponent} from './Component/livreur/livreur.component';
import {AuthentificationService} from './Service/Authentification/authentification.service';

class UserToken {
  token: string;
}
class Permissions {
  canActivate(auth: AuthentificationService): boolean {
    const utili = auth.getUser();

    if (utili !== null && utili.token != null) {
       return true;
    }
    return false;
  }
}

@Injectable()
class CanActivateTeam implements CanActivate {
  constructor(private permissions: Permissions, private auth: AuthentificationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.permissions.canActivate( this.auth );
  }
}


const routes: Routes = [
  {
    path: '',
    component: AccueilComponent
  },
  {
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'commande',
    component: CommandeComponent
  },
  {
    path: 'livreur',
    component: LivreurComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [CanActivateTeam]
  },
  {
    path: '**',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanActivateTeam, UserToken, Permissions]
})
export class AppRoutingModule { }
