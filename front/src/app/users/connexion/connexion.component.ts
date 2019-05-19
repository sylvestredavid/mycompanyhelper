import {Component, HostListener, OnDestroy, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../users.service';
import {Router} from '@angular/router';
import {LoginModel} from '../../models/Login.model';
import {UserState} from '../../shared/stores/user.reducer';
import {Store} from '@ngrx/store';
import {AjoutUser} from '../../shared/stores/user.actions';
import {MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {LightboxMailComponent} from './lightbox-mail/lightbox-mail.component';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
    selector: 'app-connexion',
    templateUrl: './connexion.component.html',
    styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    position = 'initial';
    screenWidth: number;
    isRememberMe: boolean;
    hide: boolean;

    constructor(private userService: UsersService, private fb: FormBuilder, private router: Router,
                public dialog: MatDialog, private store: Store<UserState>, private snackBar: MatSnackBar, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'hide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/hide.svg'));
        iconRegistry.addSvgIcon(
            'nohide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/nohide.svg'));
    }

    ngOnInit() {
        this.hide = true;
        this.isRememberMe = false;
        this.initForm();
        this.getScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize() {
        this.screenWidth = window.innerWidth;
    }

    /**
     * initialisation du formulaire
     */
    initForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.compose([Validators.email, Validators.required])],
            password: ['', Validators.required]
        });
    }

    /**
     * envoi du formulaire
     */
    onSubmit() {
        const values = this.loginForm.value;
        const login = new LoginModel();
        login.username = values['username'];
        login.password = values['password'];
        this.userService.signin(login).subscribe(
            user => {
                this.userService.idUser = user.managementId !== null ? user.managementId : user.id;
                this.store.dispatch(new AjoutUser(user));
                if (this.isRememberMe) { // si l'user a coché se souvenir de moi on stock le token dans le
                    localStorage.setItem('token', user.token);
                } else { // sinon on le stock dans le sessionStorage
                    sessionStorage.setItem('token', user.token);
                }
                if (user.authorities !== 'ROLE_FOURNISSEUR') { // si le role est different de fournisseur on stock l'user dans le store
                    if (login.password === 'mycompanyhelper') { // si son mdp est mycompanyhelper on le dirige vers la page de changement de mdp
                        this.router.navigate(['connexion/changePassword']);
                    } else { // sinon il est dirigé vers le dashboard
                        this.router.navigate(['users']);
                    }
                } else { // sinon on lui indique qu'il n'est pas sur la bonne page de connexion
                    this.router.navigate(['fournisseurs']);
                }
            },
            () => this.snackBar.open('Mauvais email ou mauvais mot de passe.', 'ok', {duration: 1500})
        );
    }

    ngOnDestroy() {
    }

    /**
     * ouverture de la lightbox pour demande changement de mdp
     */
    envoiMail() {
        this.dialog.open(LightboxMailComponent, {minWidth: '362px'});
    }

    rememberMe() {
        this.isRememberMe = !this.isRememberMe;
    }
}
