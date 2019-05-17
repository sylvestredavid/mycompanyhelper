import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../users.service';
import {MatDialogRef} from '@angular/material';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-lightbox-mail',
    templateUrl: './lightbox-mail.component.html',
    styleUrls: ['./lightbox-mail.component.scss']
})
export class LightboxMailComponent implements OnInit {

    msg: string;
    enCour: boolean;
    mailForm = new FormGroup({
        mail: new FormControl('', Validators.required)
    });

    constructor(private userService: UsersService, public dialogRef: MatDialogRef<LightboxMailComponent>) {
    }

    ngOnInit() {
        this.enCour = false;
    }


    /**
     * envoi du mail de demande de changement de mdp, on hash l'email pour pas qu'il soit en clair dan l'url
     */
    onSubmit() {
        this.enCour = true;
        this.userService.mailPassword(this.mailForm.value.mail, btoa(this.mailForm.value.mail)).pipe(
            finalize(() => this.enCour = false)
        ).subscribe(
            () => {
                this.msg = 'un mail viens de vous etre envoyé.';
            },
            () => this.msg = 'aucun utilisateur trouvée avec cette adresse mail.'
        );
    }

    /**
     * fermeture de la lightbox
     */
    retour() {
        this.dialogRef.close();
    }

}
