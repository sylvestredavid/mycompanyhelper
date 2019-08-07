import {Component, HostListener, OnInit} from '@angular/core';
import {DevisService} from '../devis.service';
import {FactureModel} from '../../../models/facture.model';
import {map} from 'rxjs/operators';
import {EntrepriseService} from '../../entreprise/entreprise.service';
import {EntrepriseModel} from '../../../models/entreprise.model';
import {MatCheckboxChange} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.scss']
})
export class DevisComponent implements OnInit {

  listeDevis: FactureModel[];
    screenWidth: number;
    entreprise: EntrepriseModel;
    selection: FactureModel[];

  constructor(private devisService: DevisService, private entrepriseService: EntrepriseService, private router: Router) { }

  ngOnInit() {
      this.selection = [];
      this.entrepriseService.entreprise$.subscribe(
          e => this.entreprise = e
      );
    this.devisService.findAllFactures().pipe(
        map ((f: FactureModel[]) => {
          const devis: FactureModel[] = [];
          f.forEach(
              facture => {
                if (facture.devis) {
                  devis.push(facture);
                }
              }
          );
          return devis;
        })
    ).subscribe(
        devis => {
          this.listeDevis = devis;
        }
    );
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

    changeSelection(devis: FactureModel, e: MatCheckboxChange) {
        const index = this.selection.findIndex(c => c === devis);
        if (e.checked && index === -1) {
            this.selection.push(devis);
        } else {
            this.selection.splice(index, 1);
            if (this.selection.length === 0) {
            }
        }
    }

    isSelected(value: FactureModel): boolean {
        if (this.selection.findIndex(c => c === value) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    onDetails() {
        if (this.selection) {
            this.router.navigate(['users/devis/' + this.selection[0].idFacture]);
        }
    }

    onSupprimer() {

    }
}
