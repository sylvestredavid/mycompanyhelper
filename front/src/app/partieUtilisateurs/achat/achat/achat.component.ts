import {Component, OnInit} from '@angular/core';
import {AchatModel} from '../../../models/achat.model';
import {AchatService} from '../achat.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatCheckboxChange, MatDialog} from '@angular/material';
import {AchatDialComponent} from './achat-dial/achat-dial.component';
import {CalendrierModel} from "../../../models/calendrier.model";

@Component({
  selector: 'app-achat',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.scss']
})
export class AchatComponent implements OnInit {

  listeAchats: AchatModel[];
  listeAchatAAfficher: AchatModel[];
  date: Date;
  rechercheForm: FormGroup;
  anneeListe: number[] = [];
  annee: number;
  elementSelectionne: AchatModel;

  constructor(private achatService: AchatService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {
    this.date = new Date();
    this.annee = this.date.getFullYear();
      for (let i = this.annee; i > this.annee - 20; i--) {
          this.anneeListe.push(i);
      }
    this.rechercheForm = this.fb.group({
        mois: [this.date.getMonth()],
        annee: [this.date.getFullYear()]
    });
    this.achatService.listeAchats$.subscribe(
        achats => {
          this.listeAchatAAfficher = [];
          this.listeAchats = achats;
          this.listeAchats.forEach(
              a => {
                const dateAchat = new Date(a.date);
                if (dateAchat.getMonth() === this.date.getMonth() && dateAchat.getFullYear() === this.date.getFullYear()) {
                  this.listeAchatAAfficher.push(a);
                }
              }
          );
        }
    );
  }

    recherche() {
      this.listeAchatAAfficher = [];
        this.listeAchats.forEach(
            a => {
                const dateAchat = new Date(a.date);
                if (dateAchat.getMonth() === +this.rechercheForm.value.mois && dateAchat.getFullYear() === +this.rechercheForm.value.annee) {
                    this.listeAchatAAfficher.push(a);
                }
            }
        );
    }


    changeElementSelectionne(achat: AchatModel, e: MatCheckboxChange) {
        if (e.checked) {
            this.elementSelectionne = achat;
        } else {
            this.elementSelectionne = null;
        }
    }

    onAjouter() {
        const dialogRef = this.dialog.open(AchatDialComponent, {
            width: '500px'
        });
        dialogRef.afterClosed().subscribe((result: AchatModel) => {
                if (result) {
                    this.achatService.saveAchat(result).subscribe(
                        a => {
                            this.achatService.pushAchat(a);
                        }
                    );
                }
            }
        );
    }

    onSupprimer() {
        if (this.elementSelectionne) {
            this.achatService.deleteAchat(this.elementSelectionne.id).subscribe(
                () => {
                    this.achatService.removeAchat(this.elementSelectionne.id);
                    const index = this.listeAchatAAfficher.findIndex(a => a.id === this.elementSelectionne.id);
                    this.listeAchatAAfficher.splice(index, 1);
                }
            );
        }
    }

    onModifier() {
        const dialogRef = this.dialog.open(AchatDialComponent, {
            width: '500px',
            data: {achat: this.elementSelectionne}
        });
        dialogRef.afterClosed().subscribe((result: AchatModel) => {
                if (result) {
                    this.achatService.saveAchat(result).subscribe(
                        a => {
                            this.achatService.replaceAchat(a);
                        }
                    );
                }
            }
        );
    }

    getTotalMonth(): string {
      let total = 0;
        this.listeAchatAAfficher.forEach(
            a => total += a.total
        );
        return total.toFixed(2);
    }
}
