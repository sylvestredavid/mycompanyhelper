import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EntrepriseService} from "../entreprise.service";
import {EntrepriseModel} from "../../../models/entreprise.model";
import {UsersService} from "../../../users/users.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss']
})
export class EntrepriseComponent implements OnInit {

  entrepriseForm: FormGroup;

  entreprise: EntrepriseModel;

  constructor(private entrepriseService: EntrepriseService, private fb: FormBuilder, private userService: UsersService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.entrepriseService.entreprise$.subscribe(
        e => {
          this.entreprise = e;
          this.initForm();
        }
    )
  }

  private initForm() {
    this.entrepriseForm = this.fb.group({
      nom: [this.entreprise ? this.entreprise.nom : '', Validators.required],
      adresse: [this.entreprise ? this.entreprise.adresse : '', Validators.required],
      codePostal: [this.entreprise ? this.entreprise.codePostal : '', Validators.required],
      ville: [this.entreprise ? this.entreprise.ville : '', Validators.required],
      siret: [this.entreprise ? this.entreprise.siret : '', Validators.required],
      telephone: [this.entreprise ? this.entreprise.telephone : '', Validators.required],
      email: [this.entreprise ? this.entreprise.email : '', Validators.required],
    })
  }

  onSubmit() {
    const value = this.entrepriseForm.value;
    const entreprise: EntrepriseModel = {
      id: this.entreprise ? this.entreprise.id : null,
      nom: value.nom,
      adresse: value.adresse,
      codePostal: value.codePostal,
      ville: value.ville,
      siret: value.siret,
      telephone: value.telephone,
      email: value.email,
      idUser: this.userService.idUser
    }

    this.entrepriseService.saveEntreprise(entreprise).subscribe(
        e => {
          this.entrepriseService.entreprise$.next(e);
          this.snackBar.open('Les données de l\'entreprise ont bien été mises à jour.', 'ok', {duration: 1500});
        }
    );
  }
}
