import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AnnonceService} from '../annonce.service';
import {UsersService} from '../../../users/users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {UserState} from '../../../shared/stores/user.reducer';
import {AnnonceModel} from '../../../models/annonce.model';
import {CustomValidators} from '../../../shared/validators/custom.validator';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';


@Component({
    selector: 'app-modif-annonce',
    templateUrl: './modif-annonce.component.html',
    styleUrls: ['./modif-annonce.component.scss']
})
export class ModifAnnonceComponent implements OnInit {

    annonceForm: FormGroup;

    fileToUpload: File = null;

    email: string;

    annonce: AnnonceModel;
    screenWidth: number;

    constructor(private fb: FormBuilder, private annonceService: AnnonceService, private userService: UsersService,
                private router: Router, private store: Store<UserState>, private route: ActivatedRoute, private snackBar: MatSnackBar) {
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
        this.getAnnonce(+this.route.snapshot.params.id);
        this.getScreenSize();
    }

    /**
     * initialisation du formulaire
     */
    private initForm() {
        this.annonceForm = this.fb.group({
            titre: [this.annonce.titre, Validators.required],
            corps: [this.annonce.corps, Validators.required],
            resumer: [this.annonce.resumer, Validators.required],
            image: [this.annonce.image],
            email: [this.annonce.email],
            categories: [this.annonce.categories, Validators.required],
            prixMin: [this.annonce.prixMin, Validators.required],
            prixMax: [this.annonce.prixMax, Validators.compose(
                [Validators.required, CustomValidators.prixMaxValidator()])]
        });
    }


    /**
     * upload de la photo
     * @param files photo a envoyer
     */
    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        this.annonceService.sendFile(this.fileToUpload).subscribe(
            () => this.annonceForm.get('image').setValue(this.fileToUpload.name),
            err => this.snackBar.open('un fichier porte le même nom, merci de renommer votre fichier et de reessayer.', 'ok', {duration: 6000})
        );
        this.annonceService.deleteFile(this.annonce.image);

    }


    /**
     * envoi de l'annonce
     */
    onSubmit() {
        const value = this.annonceForm.value;
        const annonce: AnnonceModel = {
            id: this.annonce.id,
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
            idFournisseur: this.userService.idUser
        };
        this.annonceService.updateAnnonce(annonce);
        this.router.navigate(['fournisseurs/annonces']);
    }

    /**
     * recuperation de l'annonce
     * @param id identifiant de l'annonce
     */
    private getAnnonce(id: number) {
        this.annonceService.getAnnonce(id).subscribe(
            annonce => {
                this.annonce = annonce;
                this.initForm();
            }
        );
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }
}
