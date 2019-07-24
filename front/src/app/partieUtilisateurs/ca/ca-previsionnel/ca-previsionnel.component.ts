import {Component, OnInit} from '@angular/core';
import {CaPrevisionnelModel} from '../../../models/caPrevisionnel.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CaService} from '../ca.service';
import {UsersService} from '../../../users/users.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-ca-previsionnel',
  templateUrl: './ca-previsionnel.component.html',
  styleUrls: ['./ca-previsionnel.component.scss']
})
export class CaPrevisionnelComponent implements OnInit {

  listeCAPrevisionnel: CaPrevisionnelModel[];

  caPrevisionnelForm: FormGroup;

  mois: string[];

  constructor(private caService: CaService, private fb: FormBuilder, private userService: UsersService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.listeCAPrevisionnel = [];
    this.mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
    this.caService.listeCAPrevisionnel$.subscribe(
        ca => {
          this.listeCAPrevisionnel = ca;
          if (this.listeCAPrevisionnel.length > 0) {
            this.listeCAPrevisionnel.sort(function(a, b) {
              return a.mois - b.mois;
            });
          }
          this.initForm();
        }
    );
  }

  private initForm() {
    this.caPrevisionnelForm = this.fb.group({
      ca: this.fb.array([])
    });
    this.addCA();
  }

  private addCA() {
    const ca = this.caPrevisionnelForm.get('ca') as FormArray;

    for (let i = 0; i < 12; i++) {
      ca.push(this.fb.group({
            id: [this.listeCAPrevisionnel.length > i ? this.listeCAPrevisionnel[i].id : 0],
            mois: [this.listeCAPrevisionnel.length > i ? this.listeCAPrevisionnel[i].mois : i],
            chiffreDAffaire: [this.listeCAPrevisionnel.length > i ? this.listeCAPrevisionnel[i].chiffreDAffaire : '', Validators.required]
          }
        )
      );
    }
  }

  get ca() {
    return this.caPrevisionnelForm.get('ca') as FormArray;
  }

  onSubmit() {
    this.caPrevisionnelForm.value.ca.forEach(
        ca => {
          const caPrevisionnel: CaPrevisionnelModel = {
            id: +ca.id,
            mois: +ca.mois,
            chiffreDAffaire: +ca.chiffreDAffaire,
            idUser: this.userService.idUser
          };
          this.caService.saveCAPrevisionnel(caPrevisionnel).subscribe(
              ca => {
                  if (this.listeCAPrevisionnel.findIndex(c => c.id === ca.id) === -1) {
                      this.caService.pushCAPrevisionnel(ca);
                  } else {
                      this.caService.replaceCAPrevisionnel(ca);
                  }
              }
          );
        }
    );
    this.snackBar.open('Les changements ont bien été pris en compte', 'ok');
  }
}
