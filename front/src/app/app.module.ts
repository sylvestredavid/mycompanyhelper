import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from './shared/guards/auth-guard.service';
import {DatePipe, registerLocaleData} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {userReducer} from './shared/stores/user.reducer';
import {AdminGuard} from './shared/guards/admin-guard.service';
import {OptionsComponent} from './partieUtilisateurs/options/options.component';
import {optionsReducer} from './shared/stores/options.reducer';
import {AjoutGenreComponent} from './partieUtilisateurs/genres/ajout-genre/ajout-genre.component';
import {FournisseurGuard} from './shared/guards/fournisseur-guard.service';
import {NotificationComponent} from './partieUtilisateurs/notification/notification.component';
import {ProduitsFormGuard} from './shared/guards/produits-form-guard.service';
import {DialogGuardComponent} from './shared/guards/dialog-guard/dialog-guard.component';
import {ClientsFormGuard} from './shared/guards/clients-form-guard.service';
import {FournisseursFormGuard} from './shared/guards/fournisseurs-form-guard.service';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {IsConnectedGuard} from './shared/guards/is-connected-guard.service';
import {MessageListComponent} from './shared/chatbot/message-list/message-list.component';
import {MessageItemComponent} from './shared/chatbot/message-item/message-item.component';
import {MdpUtils} from './shared/utils/mdp-utils';
import {RequeteUtils} from './shared/utils/requete.utils';
import {MenuComponent} from './partieUtilisateurs/menu/menu.component';
import localeFr from '@angular/common/locales/fr';
import {MenuFournisseurComponent} from './partieFournisseurs/menuFournisseur/menu-fournisseur.component';
import {CoreComponent} from './partieUtilisateurs/core/core.component';
import {CoreFournisseursComponent} from './partieFournisseurs/core-fournisseurs/core-fournisseurs.component';
import {UsersModule} from "./users/users.module";
import {SupportComponent} from './shared/support/support.component';
import {SuiviDialComponent} from './shared/dialogues/suivi-dial/suivi-dial.component';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
    entryComponents: [AjoutGenreComponent, OptionsComponent, NotificationComponent, DialogGuardComponent, MessageListComponent, SuiviDialComponent],
    declarations: [
        AppComponent,
        OptionsComponent,
        AjoutGenreComponent,
        NotificationComponent,
        DialogGuardComponent,
        LandingPageComponent,
        MessageListComponent,
        MessageItemComponent,
        MenuComponent,
        MenuFournisseurComponent,
        CoreComponent,
        CoreFournisseursComponent,
        SupportComponent,
        SuiviDialComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatButtonModule,
        MatRadioModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        HttpClientModule,
        MatToolbarModule,
        ReactiveFormsModule,
        FormsModule,
        UsersModule,
        StoreModule.forRoot({
            user: userReducer,
            options: optionsReducer
        }),
    ],
    providers: [
        AuthGuard,
        DatePipe,
        AdminGuard,
        FournisseurGuard,
        ProduitsFormGuard,
        ClientsFormGuard,
        FournisseursFormGuard,
        IsConnectedGuard,
        MdpUtils,
        RequeteUtils,

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
