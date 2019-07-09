import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {GenreService} from '../../genres/genre.service';
import {AnnuaireService} from '../../annuaire-fournisseurs/annuaire.service';
import {AnnonceModel} from '../../../models/annonce.model';

@Component({
    selector: 'app-top-fournisseurs',
    templateUrl: './top-fournisseurs.component.html',
    styleUrls: ['./top-fournisseurs.component.scss']
})
export class TopFournisseursComponent implements OnInit {

    topAnnonces: AnnonceModel[];
    position = 'initial';

    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private genreService: GenreService, private annuaireService: AnnuaireService) {
        iconRegistry.addSvgIcon(
            'right',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/right.svg'));
        iconRegistry.addSvgIcon(
            'left',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/left.svg'));
    }

    ngOnInit() {
        this.annuaireService.publishAnnonces();
        this.genreService.listeGenre$.subscribe(
            genres => {
                if (genres) {
                    this.annuaireService.listeAnnonces$.subscribe(annonces => {
                        if (annonces) {
                            let topAnnonces: AnnonceModel[] = [];
                            annonces.forEach(annonce => {
                                genres.forEach(genre => {
                                    if (annonce.categories.includes(genre.designation) && annonce.misEnAvant) {
                                        topAnnonces.push(annonce);
                                    }
                                });
                            });
                            this.topAnnonces = topAnnonces;
                        }
                    });
                }
            }
        );
    }

}
