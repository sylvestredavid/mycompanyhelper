import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {
    MatAutocompleteModule, MatBottomSheetModule, MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule, MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatNativeDateModule,
    MatSlideToggleModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from './shared/guards/auth-guard.service';
import {DatePipe, CommonModule, registerLocaleData} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {userReducer} from './shared/stores/user.reducer';
import {AdminGuard} from './shared/guards/admin-guard.service';
import {OptionsComponent} from './partieUtilisateurs/options/options.component';
import {optionsReducer} from './shared/stores/options.reducer';
import {AjoutGenreComponent} from './partieUtilisateurs/genres/ajout-genre/ajout-genre.component';
import {FournisseurGuard} from './shared/guards/fournisseur-guard.service';
import {NotificationComponent} from './partieUtilisateurs/notification/notification.component';
import {ProduitsFormGuard} from './shared/guards/produits-form-guard.service';
import {MatSnackBarModule} from '@angular/material';
import {DialogGuardComponent} from './shared/guards/dialog-guard/dialog-guard.component';
import {ClientsFormGuard} from './shared/guards/clients-form-guard.service';
import {FournisseursFormGuard} from './shared/guards/fournisseurs-form-guard.service';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {IsConnectedGuard} from './shared/guards/is-connected-guard.service';
import {MessageListComponent} from './shared/chatbot/message-list/message-list.component';
import {MessageItemComponent} from './shared/chatbot/message-item/message-item.component';
import {MdpUtils} from './shared/utils/mdp-utils';
import {RequeteUtils} from './shared/utils/requete.utils';
import {CardNumberPipe} from './shared/pipes/card-number.pipe';
import {CalendrierDialComponent} from './partieUtilisateurs/calendrier/calendrier/calendrier-dial/calendrier-dial.component';
import {MenuComponent} from './partieUtilisateurs/menu/menu.component';
import localeFr from '@angular/common/locales/fr';
import {MenuFournisseurComponent} from './partieFournisseurs/menuFournisseur/menu-fournisseur.component';
import { AppModule } from './app.module';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
    entryComponents: [OptionsComponent, NotificationComponent, DialogGuardComponent, MessageListComponent, CalendrierDialComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'powersell-front' }),
        MatBottomSheetModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatBottomSheetModule,
        MatRadioModule,
        MatNativeDateModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        HttpClientModule,
        MatToolbarModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({
            user: userReducer,
            options: optionsReducer
        }),
        CommonModule,
        AppModule,
        BrowserTransferStateModule,
    ],
    providers: [AuthGuard,
        DatePipe,
        AdminGuard,
        FournisseurGuard,
        ProduitsFormGuard,
        ClientsFormGuard,
        FournisseursFormGuard,
        IsConnectedGuard,
        MdpUtils,
        RequeteUtils,
        MatDatepickerModule,

    ],
    bootstrap: [AppComponent]
})
export class AppBrowserModule {
}
