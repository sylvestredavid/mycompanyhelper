import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MatIconRegistry, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {OptionModel} from '../../models/option.model';
import {OptionsService} from './options.service';
import {SignUpModel} from '../../models/signUp.model';
import {UserState} from '../../shared/stores/user.reducer';
import {UsersService} from '../../users/users.service';
import {DomSanitizer} from '@angular/platform-browser';
import {UserModel} from '../../models/user.modele';
import {finalize, map} from 'rxjs/operators';


@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {

    options: OptionModel;
    gestionnaires: UserModel[];
    optionsForm: FormGroup;
    gestionnaireForm: FormGroup;
    screenWidth: number;
    enCour: boolean;

    constructor(private fb: FormBuilder, private optionService: OptionsService,
                private storeUser: Store<UserState>, private userService: UsersService, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer, private  snackBar: MatSnackBar) {
        iconRegistry.addSvgIcon(
            'delete',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
    }

    ngOnInit() {
        this.initGestionnaires();
        this.initOptions();
        this.getScreenSize();
        this.enCour = false;

    }

    /**
     * recuperation de la liste des gestionnaires
     */
    initGestionnaires() {
        this.storeUser.select('user').pipe(
            map((user: UserModel) => {
                    if (user) {
                        return user[0].id;
                    }
                }
            )
        ).subscribe(
            id => {
                this.userService.findGestionnaires(id).subscribe(
                    gest => this.gestionnaires = gest
                );
            }
        );
    }

    /**
     * recuperation des options, si aucunes options enregistrées, on initialise avec des valeurs par défaut
     */
    initOptions() {
        this.optionService.options$.pipe(
            map((options) => {
                if (options) {
                    return options;
                } else {
                    return {
                        id: 0,
                        limiteClients: 5,
                        limiteStock: 5,
                    };
                }
            })
        ).subscribe(
            options => {
                this.options = options;
                this.initForms();
            }
        );
    }

    /**
     * initialisation des fomulaires
     */
    initForms() {
        this.optionsForm = new FormGroup({
            id: new FormControl(this.options.id),
            limiteStock: new FormControl(this.options.limiteStock),
            limiteClient: new FormControl(this.options.limiteClients)
        });
        this.gestionnaireForm = new FormGroup({
                name: new FormControl('', Validators.required),
                username: new FormControl('', Validators.compose([Validators.required, Validators.email])),
            }
        );
    }

    /**
     * envoi du formulaire d'options
     */
    onSubmitOptions() {
        const value = this.optionsForm.value;

        if (this.optionsForm.dirty) {
            const optionsEnvoi: OptionModel = {
                id: value.id,
                limiteStock: value.limiteStock,
                limiteClients: value.limiteClient,
                idUser: this.userService.idUser
            };
            this.optionService.updateOptions(optionsEnvoi).subscribe(
                options => {
                    this.optionService.options$.next(options);
                    this.snackBar.open('les changements ont bien été pris en compte.', 'ok', {duration: 1500})
                }
            );
        }
    }

    /**
     * envoi d'un nouveau gestionnaire
     */
    onSubmitGest() {
        this.enCour = true;
        const role = ['gestionnaire'];
        this.storeUser.select('user').subscribe(
            user => {
                const signup: SignUpModel = {
                    name: this.gestionnaireForm.value.name,
                    username: this.gestionnaireForm.value.username,
                    password: 'mycompanyhelper',
                    role: role,
                    managementId: user[0].id
                };
                this.userService.signup(signup).pipe(
                    finalize(() => {
                        this.enCour = false;
                        this.gestionnaireForm.reset();
                    })
                ).subscribe(
                    gest => this.gestionnaires.push(gest)
                );
            }
        );
    }

    /**
     * supression d'un gestionnaire
     * @param id l'identifiant du gestionnaire
     */
    onDelete(id: number) {
        this.userService.deleteGestionnaire(id);
        const index = this.gestionnaires.findIndex(gest => {
            if (gest.id === id) {
                return true;
            }
        });
        this.gestionnaires.splice(index, 1);
    }

    ngOnDestroy(): void {
    }

    /**
     * methode pour recuperer la largeur de l'ecran afin de rendre la page responsive (en plus du css)
     */
    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    onDeleteCompte() {
        this.userService.stop().subscribe(
            () => {
                sessionStorage.removeItem('token');
                localStorage.removeItem('token');
                this.snackBar.open('votre compte à bien été supprimé.', 'ok', {duration: 2000})
                setTimeout(() => window.location.replace(''), 2000);
            }
        );
    }
}
