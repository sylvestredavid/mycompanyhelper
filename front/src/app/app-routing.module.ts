import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CoreComponent} from './partieUtilisateurs/core/core.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {MenuComponent} from './partieUtilisateurs/menu/menu.component';
import {IsConnectedGuard} from './shared/guards/is-connected-guard.service';
import {SupportComponent} from "./shared/support/support.component";
import {OptionsComponent} from "./partieUtilisateurs/options/options.component";
import {AuthGuard} from "./shared/guards/auth-guard.service";
import {AdminGuard} from "./shared/guards/admin-guard.service";

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent,
        canActivate: [IsConnectedGuard]
    },
    {
        path: 'connexion',
        loadChildren: './users/users.module#UsersModule'
    },
    // {
    //     path: 'annonces',
    //     loadChildren: './annonces-fournisseurs-hors-connexion/annuaire.module#AnnuaireModule'
    // },
    {
        path: 'users',
        component: CoreComponent,
        children: [
            {
                path: '',
                component: MenuComponent,
            },
            {
                path: 'options',
                canActivate: [AdminGuard],
                component: OptionsComponent,
            },
            {
                path: 'support',
                component: SupportComponent,
            },
            {
                path: 'achats',
                loadChildren: './partieUtilisateurs/achat/achat.module#AchatModule'
            },
            {
                path: 'dashboard',
                loadChildren: './partieUtilisateurs/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'caPrevisionnel',
                loadChildren: './partieUtilisateurs/ca/ca.module#CaModule'
            },
            {
                path: 'produits',
                loadChildren: './partieUtilisateurs/produits/produits.module#ProduitsModule'
            },
            {
                path: 'clients',
                loadChildren: './partieUtilisateurs/clients/clients.module#ClientsModule'
            },
            {
                path: 'creer-facture',
                loadChildren: './partieUtilisateurs/factures/factures.module#FacturesModule'
            },
            {
                path: 'fournisseurs',
                loadChildren: './partieUtilisateurs/fournisseurs/fournisseurs.module#FournisseursModule'
            },
            // {
            //     path: 'annuaire-fournisseurs',
            //     loadChildren: './partieUtilisateurs/annuaire-fournisseurs/annuaire.module#AnnuaireModule'
            // },
            {
                path: 'calendrier',
                loadChildren: './partieUtilisateurs/calendrier/calendrier.module#CalendrierModule'
            },
            {
                path: 'monEntreprise',
                loadChildren: './partieUtilisateurs/entreprise/entreprise.module#EntrepriseModule'
            }
        ]
    },
    // {
    //     path: 'fournisseurs',
    //     component: CoreFournisseursComponent,
    //     children: [
    //         {
    //             path: '',
    //             component: MenuFournisseurComponent,
    //         },
    //         {
    //             path: 'support',
    //             component: SupportComponent,
    //         },
    //         {
    //             path: 'annonces',
    //             loadChildren: './partieFournisseurs/annonces/annonces.module#AnnoncesModule'
    //         }
    //     ]
    // }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
