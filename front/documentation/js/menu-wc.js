'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">front documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AnnoncesModule.html" data-type="entity-link">AnnoncesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AnnoncesModule-142a1ca53099504a67f0f4c199bb167b"' : 'data-target="#xs-components-links-module-AnnoncesModule-142a1ca53099504a67f0f4c199bb167b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AnnoncesModule-142a1ca53099504a67f0f4c199bb167b"' :
                                            'id="xs-components-links-module-AnnoncesModule-142a1ca53099504a67f0f4c199bb167b"' }>
                                            <li class="link">
                                                <a href="components/AnnoncesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AnnoncesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreerAnnonceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CreerAnnonceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModifAnnonceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModifAnnonceComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AnnuaireModule.html" data-type="entity-link">AnnuaireModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AnnuaireModule-3517329c8d3f55e5f622b40a5d6e1f3e"' : 'data-target="#xs-components-links-module-AnnuaireModule-3517329c8d3f55e5f622b40a5d6e1f3e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AnnuaireModule-3517329c8d3f55e5f622b40a5d6e1f3e"' :
                                            'id="xs-components-links-module-AnnuaireModule-3517329c8d3f55e5f622b40a5d6e1f3e"' }>
                                            <li class="link">
                                                <a href="components/ContactFournisseurComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContactFournisseurComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailAnnonceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetailAnnonceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListeAnnoncesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListeAnnoncesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-47bf28859b80ff50d76381b18e505f6c"' : 'data-target="#xs-components-links-module-AppModule-47bf28859b80ff50d76381b18e505f6c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-47bf28859b80ff50d76381b18e505f6c"' :
                                            'id="xs-components-links-module-AppModule-47bf28859b80ff50d76381b18e505f6c"' }>
                                            <li class="link">
                                                <a href="components/AjoutGenreComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AjoutGenreComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CoreComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoreComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CoreFournisseursComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoreFournisseursComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogGuardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DialogGuardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandingPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LandingPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OptionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OptionsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ClientsModule.html" data-type="entity-link">ClientsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ClientsModule-3f7e902c2ab78149bf623b959acddc54"' : 'data-target="#xs-components-links-module-ClientsModule-3f7e902c2ab78149bf623b959acddc54"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ClientsModule-3f7e902c2ab78149bf623b959acddc54"' :
                                            'id="xs-components-links-module-ClientsModule-3f7e902c2ab78149bf623b959acddc54"' }>
                                            <li class="link">
                                                <a href="components/ClientDetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClientDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClientFacturesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClientFacturesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClientsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClientsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CoreModule-29ed38c7849d8bf27221ee4966610046"' : 'data-target="#xs-components-links-module-CoreModule-29ed38c7849d8bf27221ee4966610046"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-29ed38c7849d8bf27221ee4966610046"' :
                                            'id="xs-components-links-module-CoreModule-29ed38c7849d8bf27221ee4966610046"' }>
                                            <li class="link">
                                                <a href="components/CoreComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoreComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CoreModule-e4e532b274ec85961bb5d0ca49187b60-1"' : 'data-target="#xs-components-links-module-CoreModule-e4e532b274ec85961bb5d0ca49187b60-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-e4e532b274ec85961bb5d0ca49187b60-1"' :
                                            'id="xs-components-links-module-CoreModule-e4e532b274ec85961bb5d0ca49187b60-1"' }>
                                            <li class="link">
                                                <a href="components/CoreFournisseursComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoreFournisseursComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link">DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-aa63be7a6b7cab74d40daf8a5baef8f8"' : 'data-target="#xs-components-links-module-DashboardModule-aa63be7a6b7cab74d40daf8a5baef8f8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-aa63be7a6b7cab74d40daf8a5baef8f8"' :
                                            'id="xs-components-links-module-DashboardModule-aa63be7a6b7cab74d40daf8a5baef8f8"' }>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GraphiqueComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GraphiqueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableauClientsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableauClientsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableauProduitComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableauProduitComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopFournisseursComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TopFournisseursComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FacturesModule.html" data-type="entity-link">FacturesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FacturesModule-931b214da7755b3bf8f2746499c6d224"' : 'data-target="#xs-components-links-module-FacturesModule-931b214da7755b3bf8f2746499c6d224"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FacturesModule-931b214da7755b3bf8f2746499c6d224"' :
                                            'id="xs-components-links-module-FacturesModule-931b214da7755b3bf8f2746499c6d224"' }>
                                            <li class="link">
                                                <a href="components/CreateFactureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CreateFactureComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FournisseursModule.html" data-type="entity-link">FournisseursModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FournisseursModule-84a50b8b99c15be0748d986226d7e09c"' : 'data-target="#xs-components-links-module-FournisseursModule-84a50b8b99c15be0748d986226d7e09c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FournisseursModule-84a50b8b99c15be0748d986226d7e09c"' :
                                            'id="xs-components-links-module-FournisseursModule-84a50b8b99c15be0748d986226d7e09c"' }>
                                            <li class="link">
                                                <a href="components/DialogFournisseursComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DialogFournisseursComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FournisseursListeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FournisseursListeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProduitsModule.html" data-type="entity-link">ProduitsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProduitsModule-7be913ab9657cc96c753a35daf7e1def"' : 'data-target="#xs-components-links-module-ProduitsModule-7be913ab9657cc96c753a35daf7e1def"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProduitsModule-7be913ab9657cc96c753a35daf7e1def"' :
                                            'id="xs-components-links-module-ProduitsModule-7be913ab9657cc96c753a35daf7e1def"' }>
                                            <li class="link">
                                                <a href="components/ProduitsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProduitsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProduitsHorsVenteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProduitsHorsVenteComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedModule-7d03b991277696b4f84ea9db12a6b351"' : 'data-target="#xs-directives-links-module-SharedModule-7d03b991277696b4f84ea9db12a6b351"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-7d03b991277696b4f84ea9db12a6b351"' :
                                        'id="xs-directives-links-module-SharedModule-7d03b991277696b4f84ea9db12a6b351"' }>
                                        <li class="link">
                                            <a href="directives/InputReadOnlyDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputReadOnlyDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UsersModule-fae0ea26f2bbbdc6d68b3a521e1b077c"' : 'data-target="#xs-components-links-module-UsersModule-fae0ea26f2bbbdc6d68b3a521e1b077c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersModule-fae0ea26f2bbbdc6d68b3a521e1b077c"' :
                                            'id="xs-components-links-module-UsersModule-fae0ea26f2bbbdc6d68b3a521e1b077c"' }>
                                            <li class="link">
                                                <a href="components/ChangePasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChangePasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnexionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConnexionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InscriptionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InscriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LightboxMailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LightboxMailComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ChangePasswordComponent-1.html" data-type="entity-link">ChangePasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConnexionComponent-1.html" data-type="entity-link">ConnexionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetailAnnonceComponent-1.html" data-type="entity-link">DetailAnnonceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InscriptionComponent-1.html" data-type="entity-link">InscriptionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LightboxMailComponent-1.html" data-type="entity-link">LightboxMailComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AjoutUser.html" data-type="entity-link">AjoutUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnnonceModel.html" data-type="entity-link">AnnonceModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/CAModel.html" data-type="entity-link">CAModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClientModel.html" data-type="entity-link">ClientModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomValidators.html" data-type="entity-link">CustomValidators</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUser.html" data-type="entity-link">DeleteUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailModel.html" data-type="entity-link">EmailModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FactureModel.html" data-type="entity-link">FactureModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FournisseurAnnuaireModel.html" data-type="entity-link">FournisseurAnnuaireModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FournisseurModel.html" data-type="entity-link">FournisseurModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenreModel.html" data-type="entity-link">GenreModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOptions.html" data-type="entity-link">GetOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginModel.html" data-type="entity-link">LoginModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationModel.html" data-type="entity-link">NotificationModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/OptionModel.html" data-type="entity-link">OptionModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProduitModel.html" data-type="entity-link">ProduitModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProduitsFactureModel.html" data-type="entity-link">ProduitsFactureModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpModel.html" data-type="entity-link">SignUpModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserModel.html" data-type="entity-link">UserModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnnonceService.html" data-type="entity-link">AnnonceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AnnuaireService.html" data-type="entity-link">AnnuaireService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientsService.html" data-type="entity-link">ClientsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceService.html" data-type="entity-link">DeviceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FactureService.html" data-type="entity-link">FactureService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FournisseursService.html" data-type="entity-link">FournisseursService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GenreService.html" data-type="entity-link">GenreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link">NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OptionsService.html" data-type="entity-link">OptionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProduitService.html" data-type="entity-link">ProduitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link">ThemeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link">UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService-1.html" data-type="entity-link">UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminGuard.html" data-type="entity-link">AdminGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ClientsFormGuard.html" data-type="entity-link">ClientsFormGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/FournisseurGuard.html" data-type="entity-link">FournisseurGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/FournisseursFormGuard.html" data-type="entity-link">FournisseursFormGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ProduitsFormGuard.html" data-type="entity-link">ProduitsFormGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ProduitsResolver.html" data-type="entity-link">ProduitsResolver</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link">DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OptionsState.html" data-type="entity-link">OptionsState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserState.html" data-type="entity-link">UserState</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});