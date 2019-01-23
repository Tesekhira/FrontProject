import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './Component/navigation/navigation.component';
import { FooterComponent } from './Component/footer/footer.component';
import { SignInComponent } from './Component/sign-in/sign-in.component';
import { SignUpComponent } from './Component/sign-up/sign-up.component';
import { AccueilComponent } from './Component/accueil/accueil.component';
import { ErrorComponent } from './Component/error/error.component';

import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ProfileComponent } from './Component/profile/profile.component';
import { CommandeComponent } from './Component/commande/commande.component';
import { BrowserAnimationsModule , NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule, MatListModule,
  MatMenuModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
  MatToolbarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatBadgeModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTabsModule} from '@angular/material/tabs';
import { LivreurComponent } from './Component/livreur/livreur.component';
import {AuthentificationService} from './Service/Authentification/authentification.service';
import {HttpService} from './Service/Http/http.service';
import {DataService} from './Service/Data/data.service';
import { ModalComponent } from './Component/modal/modal.component';
import {ToastService} from './Service/Toast/toast.service';
import { ToastrModule } from 'ng6-toastr-notifications';
import { MatCardModule } from '@angular/material';
import {SocketService} from './Service/Socket/socket.service';

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
    LivreurComponent,
    ModalComponent
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
    MatTabsModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    MatBadgeModule,
    MatCardModule
  ],
  exports: [ ModalComponent ],
  entryComponents: [ModalComponent],
  providers: [AuthentificationService, HttpService, DataService, ToastService , SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
