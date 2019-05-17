import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GenreService} from '../genre.service';
import {MatDialogRef} from '@angular/material';
import {GenreModel} from '../../../models/genre.model';
import {UsersService} from '../../../users/users.service';

@Component({
    selector: 'app-ajout-genre',
    templateUrl: './ajout-genre.component.html',
    styleUrls: ['./ajout-genre.component.scss']
})
export class AjoutGenreComponent implements OnInit, OnDestroy {

    genreForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<AjoutGenreComponent>, private genreService: GenreService,
                private userService: UsersService) {
    }

    ngOnInit() {
        this.initForm();
    }

    /**
     * initialisation du formulaire
     */
    initForm(){
        this.genreForm = new FormGroup({
            designation: new FormControl('', Validators.required)
        });
    }

    /**
     * envoi du formulaire
     */
    onSave() {
        const genre: GenreModel = {
            idGenre: null,
            designation: this.genreForm.value.designation,
            produits: null,
            idUser: this.userService.idUser
        };
        this.genreService.saveGenre(genre);
        this.dialogRef.close();
    }

    onQuit() {
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
    }

}
