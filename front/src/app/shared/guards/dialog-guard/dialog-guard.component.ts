import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

/**
 * boite de dialog ouverte par les methdes canDeactivate
 */
@Component({
  selector: 'app-dialog-guard',
  templateUrl: './dialog-guard.component.html',
  styleUrls: ['./dialog-guard.component.scss']
})
export class DialogGuardComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogGuardComponent>) { }

  ngOnInit() {
  }

}
