import {Component, Inject, OnInit} from '@angular/core';
import {AchatModel} from '../../../../models/achat.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {UsersService} from "../../../../users/users.service";

interface DialogData {
  achat: AchatModel;
}

@Component({
  selector: 'app-achat-dial',
  templateUrl: './achat-dial.component.html',
  styleUrls: ['./achat-dial.component.scss']
})
export class AchatDialComponent implements OnInit {

  achatForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AchatDialComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private fb: FormBuilder, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private adapter: DateAdapter<any>,
              private userService: UsersService) {
    iconRegistry.addSvgIcon(
        'sortie',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
  }

  ngOnInit() {
    this.adapter.setLocale('fr');
    this.initForm();
  }

  private initForm() {
    this.achatForm = this.fb.group({
      designation: [this.data ? this.data.achat.designation : '', Validators.required],
      prixUnitaire: [this.data ? this.data.achat.prixUnitaire : '', Validators.required],
      quantite: [this.data ? this.data.achat.quantite : '', Validators.required],
      date: [this.data ? new Date(this.data.achat.date) : new Date(), Validators.required],
    });
  }

  onSubmit() {
    const achat: AchatModel = {
      id: this.data ? this.data.achat.id : 0,
      designation: this.achatForm.value.designation,
      prixUnitaire: +this.achatForm.value.prixUnitaire,
      quantite: +this.achatForm.value.quantite,
      total: this.achatForm.value.prixUnitaire * this.achatForm.value.quantite,
      date: this.achatForm.value.date,
      idUser: this.userService.idUser
    };
    this.dialogRef.close(achat);

  }

  calculTotal() {
    if(this.achatForm.value.prixUnitaire && this.achatForm.value.quantite) {
      return this.achatForm.value.prixUnitaire * this.achatForm.value.quantite;
    } else {
      return 0;
    }
  }
}
