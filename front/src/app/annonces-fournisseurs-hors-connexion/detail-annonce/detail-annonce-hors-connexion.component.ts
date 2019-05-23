import {Component, HostListener, OnDestroy, OnInit, Inject, Renderer2, AfterViewInit} from '@angular/core';
import {AnnonceModel} from '../../models/annonce.model';
import {ActivatedRoute} from '@angular/router';
import {AnnuaireService} from '../annuaire.service';
import {Subscription} from 'rxjs';
import {EmailModel} from '../../models/email.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import {SocketService} from '../../shared/socket.service';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-detail-annonce-hors-connexion',
    templateUrl: './detail-annonce-hors-connexion.component.html',
    styleUrls: ['./detail-annonce-hors-connexion.component.scss']
})
export class DetailAnnonceHorsConnexionComponent implements OnInit, AfterViewInit, OnDestroy {

    titre: string;
    emailTo: string;
    emailFrom = '';
    mailForm: FormGroup;
    id: number;
    annonce: AnnonceModel;
    subscription: Subscription;
    screenWidth: number;

    constructor(private annuaireService: AnnuaireService, private route: ActivatedRoute, private renderer2: Renderer2,
                private fb: FormBuilder, private snackBar: MatSnackBar, private titleService: Title) {
    }

    ngOnInit() {
        this.getAnnonce(+this.route.snapshot.params.id);
        this.getScreenSize();
    }

    ngAfterViewInit(): void {
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
        setTimeout(() => {this.initScripts()}, 500);
    }

    /**
     * recuperation de l'annonce
     * @param id identifiant de l'annonce
     */
    private getAnnonce(id: number) {
        this. subscription = this.annuaireService.getAnnonce(id).subscribe(
            annonce => {
                this.annonce = annonce;
                this.titleService.setTitle( this.annonce.titre );
                this.initForm();
            }
        )
    }

    /**
     * envoi du formulaire
     */
    onSubmit() {
        const mail: EmailModel = {
            to: this.emailTo,
            from: this.mailForm.value.email,
            titre: `Votre annonce "${this.annonce.titre}" sur mycompanyhelper.`,
            corps: this.mailForm.value.corps
        };

        this.annuaireService.sendMail(mail).subscribe(
            () => {
                this.annuaireService.augmenterNbContacts(this.annonce.id).subscribe();
                this.snackBar.open('L\'email a bien été envoyé.', 'ok', {duration: 1500});
            }
        );
    }

    /**
     * initialisation du formulaire
     */
    private initForm() {
        this.emailTo = this.annonce.email;

        this.mailForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            corps: ['', Validators.required]
        });
    }


    initScripts(){
        if(document.getElementById('33883-31')) {
            const s = this.renderer2.createElement('script');
            s.src = '//ads.themoneytizer.com/s/gen.js?type=31';
            document.getElementById('33883-31').appendChild(s)

            const s2 = this.renderer2.createElement('script');
            s2.src = '//ads.themoneytizer.com/s/requestform.js?siteId=33883&formatId=31';
            document.getElementById('33883-31').appendChild(s2)
        }

        if(document.getElementById('33883-3')) {
            const s3 = this.renderer2.createElement('script');
            s3.src = '//ads.themoneytizer.com/s/gen.js?type=3';
            document.getElementById('33883-3').appendChild(s3)

            const s4 = this.renderer2.createElement('script');
            s4.src = '//ads.themoneytizer.com/s/requestform.js?siteId=33883&formatId=3';
            document.getElementById('33883-3').appendChild(s4)
        }
    }


        ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
