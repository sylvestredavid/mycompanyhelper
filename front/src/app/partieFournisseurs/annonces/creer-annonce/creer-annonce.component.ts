import {Component, HostListener, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AnnonceService} from '../annonce.service';
import {AnnonceModel} from '../../../models/annonce.model';
import {UsersService} from '../../../users/users.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {CustomValidators} from '../../../shared/validators/custom.validator';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {SocketService} from '../../../shared/socket.service';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
    selector: 'app-creer-annonce',
    templateUrl: './creer-annonce.component.html',
    styleUrls: ['./creer-annonce.component.scss']
})
export class CreerAnnonceComponent implements OnInit {

    annonceForm: FormGroup;

    fileToUpload: File = null;

    email: string;
    screenWidth: number;
    date;

    constructor(@Inject(WINDOW) private window: Window, private fb: FormBuilder, private annonceService: AnnonceService, private userService: UsersService,
                private router: Router, private store: Store<UserState>, private snackBar: MatSnackBar, private socket: SocketService) {
        this.store.select('user').pipe(
            map(user => {
                if (user) {
                    return user[0].username;
                }
            })
        ).subscribe(
            email => this.email = email
        );
    }

    ngOnInit() {
        this.date = new Date().toJSON()
        this.initForm();
        this.getScreenSize();
    }

    /**
     * initiation du formulaire
     */
    private initForm() {
        this.annonceForm = this.fb.group({
            titre: ['', Validators.required],
            corps: ['', Validators.required],
            resumer: ['', Validators.required],
            image: [''],
            email: [this.email],
            categories: ['', Validators.required],
            prixMin: [0, Validators.required],
            prixMax: [0, Validators.compose(
                [Validators.required, CustomValidators.prixMaxValidator()])]
        });
    }

    /**
     * upload de la photo
     * @param files photo a envoyer
     */
    handleFileInput(files: FileList) {
        if (this.fileToUpload) {
            this.annonceService.deleteFile(this.fileToUpload.name);
        }
        this.fileToUpload = files.item(0);
        this.annonceService.sendFile(this.fileToUpload).subscribe(
            () => this.annonceForm.get('image').setValue(this.fileToUpload.name),
            err => this.snackBar.open('un fichier porte le même nom, merci de renommer votre fichier et de reessayer.', 'ok', {duration: 6000})
        );

    }

    /**
     * envoi de l'annonce
     */
    onSubmit() {
        const value = this.annonceForm.value;
        const annonce: AnnonceModel = {
            titre: value.titre,
            corps: value.corps,
            email: value.email,
            resumer: value.resumer,
            image: value.image,
            categories: value.categories,
            prixMin: value.prixMin,
            prixMax: value.prixMax,
            nbContacts: 0,
            misEnAvant: false,
            idFournisseur: this.userService.idUser,
            datePoste: new Date().toJSON()
        };
        this.annonceService.saveAnnonce(annonce).subscribe(
            annonce => {
                this.socket.ajoutAnnonce(annonce);
                this.annonceService.pushAnnonce(annonce);
            }
        );
        this.router.navigate(['fournisseurs/annonces']);
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = this.window.innerWidth;
    }
}
