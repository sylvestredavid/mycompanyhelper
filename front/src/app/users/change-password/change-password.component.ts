import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserState} from '../../shared/stores/user.reducer';
import {Store} from '@ngrx/store';
import {UsersService} from '../users.service';
import {MatIconRegistry, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {UserModel} from '../../models/user.modele';
import {CustomValidators} from '../../shared/validators/custom.validator';
import {MdpUtils} from '../../shared/utils/mdp-utils';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

    passwordForm: FormGroup;

    user: UserModel;

    email: string;

    hideMdp1: boolean;

    hideMdp2: boolean;

    regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g;


    constructor(private store: Store<UserState>, private userService: UsersService, private fb: FormBuilder,
                private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute, public mdpUtils: MdpUtils,
                iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'hide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/hide.svg'));
        iconRegistry.addSvgIcon(
            'nohide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/nohide.svg'));
    }

    ngOnInit() {
        this.hideMdp1 = this.hideMdp2 = true;
        this.getEmail();
        this.initForm();

    }

    /**
     * envoi du formulaire
     */
    onSubmit() {
        this.userService.changePassword(this.passwordForm.value.password1, this.email).subscribe(
            () => {
                if (this.user) {
                    sessionStorage.setItem('token', this.user.token);
                    this.router.navigate(['users']);
                } else {
                    this.router.navigate(['users']);
                }
                this.snackBar.open('Votre mot de passe a bien été changé.', 'ok', {duration: 1500, verticalPosition: 'top'});
            }
        );

    }

    ngOnDestroy(): void {
    }

    /**
     * recupere l'email, soit dans les params de la route, soit dans le store.
     * si c'est une premiere connexion d'un gestionnaire, on recupere dans le store,
     * si c'est suite a une demande, l'email est dans la route haché et on le de-hashe
     */
    private getEmail() {
        if (this.route.snapshot.params.email) {
            this.email = atob(this.route.snapshot.params.email);
        } else {
            this.store.select('user').subscribe(
                user => {
                    if (user) {
                        this.user = user[0];
                        this.email = this.user.username;
                    }
                }
            );
        }
    }

    /**
     * initialisation du formulaire
     */
    private initForm() {
        this.passwordForm = this.fb.group({
            password1: ['', Validators.compose([Validators.required, Validators.pattern(this.regex)])],
            password2: ['', Validators.compose(
                [Validators.required, CustomValidators.passwordMatchValidator()])]
        });
    }
}
