import {Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {CalendrierModel} from '../../../../models/calendrier.model';
import {DatePipe} from '@angular/common';

interface DialogData {
    calendrier: CalendrierModel;
    start: string
}

@Component({
    selector: 'app-calendrier-dial',
    templateUrl: './calendrier-dial.component.html',
    styleUrls: ['./calendrier-dial.component.scss']
})
export class CalendrierDialComponent implements OnInit {

    calendrierForm: FormGroup;
    heures: string[];
    minutes: string[];
    heureStart = '00';
    minuteStart = '00';
    heureEnd = '00';
    minuteEnd = '00';
    dateEnd: string;

    constructor(public dialogRef: MatDialogRef<CalendrierDialComponent>, private datePipe: DatePipe,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer, private adapter: DateAdapter<any>) {
        iconRegistry.addSvgIcon(
            'sortie',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
    }

    ngOnInit() {
        this.initDateFin();
        this.initHeures();
        this.adapter.setLocale('fr');
        this.heures = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
            '16', '17', '18', '19', '20', '21', '22', '23'];
        this.minutes = ['00', '15', '30', '45'];
        this.calendrierForm = this.fb.group({
            title: [this.data.calendrier ? this.data.calendrier.title : '', Validators.required],
            start: [this.data.calendrier ? this.data.calendrier.start : this.data.start],
            heureStart: [this.heureStart],
            minuteStart: [this.minuteStart],
            end: [this.dateEnd],
            heureEnd: [this.heureEnd],
            minuteEnd: [this.minuteEnd],
        });
    }

    onSubmit() {
        const dateFin = this.calendrierForm.value.end ? this.calendrierForm.value.end : null;
        const c: CalendrierModel = {
            id: this.data.calendrier ? this.data.calendrier.id : 0,
            title: this.calendrierForm.value.title,
            start: this.datePipe.transform(this.calendrierForm.value.start, 'yyyy-MM-dd') + 'T' +
                this.calendrierForm.value.heureStart + ':' + this.calendrierForm.value.minuteStart + ':00',
            end: dateFin ? this.datePipe.transform(dateFin, 'yyyy-MM-dd') + 'T' + this.calendrierForm.value.heureEnd +
                ':' + this.calendrierForm.value.minuteEnd + ':00' : null,
            idUser: this.data.calendrier ? this.data.calendrier.idUser : 0,
        };
        this.dialogRef.close(c);
    }

    onDelete() {
        this.dialogRef.close('supprimer');
    }

    private initHeures() {
        if (this.data.calendrier) {
            if (this.data.calendrier.start) {
                this.heureStart = this.data.calendrier.start.substr(11, 2);
                this.minuteStart = this.data.calendrier.start.substr(14, 2);
            } else {
                this.heureStart = '00';
                this.minuteStart = '00';
            }
            if (this.data.calendrier.end) {
                this.heureEnd = this.data.calendrier.end.substr(11, 2);
                this.minuteEnd = this.data.calendrier.end.substr(14, 2);
            } else {
                this.heureEnd = '00';
                this.minuteEnd = '00';
            }
        }
    }

    private initDateFin() {
        if (this.data.calendrier && !this.data.calendrier.end) {
            this.dateEnd = this.data.calendrier.start;
        } else if (this.data.start) {
            this.dateEnd = this.data.start;
        } else if (this.data.calendrier && this.data.calendrier.end) {
            this.dateEnd = this.data.calendrier.end;
        }
    }
}
