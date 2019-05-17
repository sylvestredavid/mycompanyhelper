import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CoreComponent} from './partieUtilisateurs/core/core.component';
import {CoreFournisseursComponent} from './partieFournisseurs/core-fournisseurs/core-fournisseurs.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {MenuComponent} from './partieUtilisateurs/menu/menu.component';
import {MenuFournisseurComponent} from './partieFournisseurs/menuFournisseur/menu-fournisseur.component';

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent,
    },
    {
        path: 'connexion',
        loadChildren: './users/users.module#UsersModule'
    },
    {
        path: 'annonces',
        loadChildren: './annonces-fournisseurs-hors-connexion/annuaire.module#AnnuaireModule'
    },
    {
        path: 'users',
        component: CoreComponent,
        children: [
            {
                path: '',
                component: MenuComponent,
            },
            {
                path: 'dashboard',
                loadChildren: './partieUtilisateurs/dashboard/dashboard.module#DashboardModule'
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
            {
                path: 'annuaire-fournisseurs',
                loadChildren: './partieUtilisateurs/annuaire-fournisseurs/annuaire.module#AnnuaireModule'
            },
            {
                path: 'calendrier',
                loadChildren: './partieUtilisateurs/calendrier/calendrier.module#CalendrierModule'
            }
        ]
    },
    {
        path: 'fournisseurs',
        component: CoreFournisseursComponent,
        children: [
            {
                path: '',
                component: MenuFournisseurComponent,
            },
            {
                path: 'annonces',
                loadChildren: './partieFournisseurs/annonces/annonces.module#AnnoncesModule'
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
