import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ErrorComponent } from './error/error.component';

import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { ProfileComponent } from './profile/profile.component';
import { CommandeComponent } from './commande/commande.component';
import { BrowserAnimationsModule ,NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule, MatListModule,
  MatMenuModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
  MatToolbarModule,MatInputModule,MatFormFieldModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatTabsModule} from '@angular/material/tabs';
import { LivreurComponent } from './livreur/livreur.component';
import {AuthentificationService} from "./Authentification/authentification.service";


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    SignInComponent,
    SignUpComponent,
    AccueilComponent,
    ErrorComponent,
    ProfileComponent,
    CommandeComponent,
    LivreurComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatRadioModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule
  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
