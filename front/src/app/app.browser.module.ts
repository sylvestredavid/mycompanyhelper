import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from './shared/guards/auth-guard.service';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {userReducer} from './shared/stores/user.reducer';
import {AdminGuard} from './shared/guards/admin-guard.service';
import {OptionsComponent} from './partieUtilisateurs/options/options.component';
import {optionsReducer} from './shared/stores/options.reducer';
import {FournisseurGuard} from './shared/guards/fournisseur-guard.service';
import {NotificationComponent} from './partieUtilisateurs/notification/notification.component';
import {ProduitsFormGuard} from './shared/guards/produits-form-guard.service';
import {DialogGuardComponent} from './shared/guards/dialog-guard/dialog-guard.component';
import {ClientsFormGuard} from './shared/guards/clients-form-guard.service';
import {FournisseursFormGuard} from './shared/guards/fournisseurs-form-guard.service';
import {IsConnectedGuard} from './shared/guards/is-connected-guard.service';
import {MessageListComponent} from './shared/chatbot/message-list/message-list.component';
import {MdpUtils} from './shared/utils/mdp-utils';
import {RequeteUtils} from './shared/utils/requete.utils';
import {CalendrierDialComponent} from './partieUtilisateurs/calendrier/calendrier/calendrier-dial/calendrier-dial.component';
import localeFr from '@angular/common/locales/fr';
import {AppModule} from './app.module';

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
