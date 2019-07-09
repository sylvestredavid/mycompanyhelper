import {Component, Inject, OnInit} from '@angular/core';
import {UsersService} from '../../../users/users.service';
import {SuiviConsommationModel} from '../../../models/suivi-consommation.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

interface DialogData {
  suivi: SuiviConsommationModel;
}

@Component({
  selector: 'app-suivi-dial',
  templateUrl: './suivi-dial.component.html',
  styleUrls: ['./suivi-dial.component.scss']
})
export class SuiviDialComponent implements OnInit {

  suivi: SuiviConsommationModel;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private userService: UsersService, iconRegistry: MatIconRegistry,
  sanitizer: DomSanitizer, public dialogRef: MatDialogRef<SuiviDialComponent>, private snackBar: MatSnackBar) {
    iconRegistry.addSvgIcon(
        'sortie',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
  }

  ngOnInit() {
    this.suivi = this.data.suivi;
  }

  onChangeAbonnement() {
    this.userService.changeAbonnement().subscribe(
        () => this.snackBar.open('Votre abonnement a bien été changé.', 'ok', {duration: 2000})
    );
  }

  close() {
    this.dialogRef.close();
  }

}
