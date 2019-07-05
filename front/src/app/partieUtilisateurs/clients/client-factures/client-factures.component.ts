import {Component, HostListener, Input, OnInit, Inject} from '@angular/core';
import {FactureModel} from '../../../models/facture.model';
import {ClientModel} from '../../../models/client.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import {NotificationsService} from '../../notification/notifications.service';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-client-factures',
  templateUrl: './client-factures.component.html',
  styleUrls: ['./client-factures.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClientFacturesComponent implements OnInit {

  @Input() client: ClientModel;
  dataSource: FactureModel[];
  columnsToDisplay = ['numero', 'date', 'total'];
  expandedElement: FactureModel | null;
  screenWidth: number;

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.dataSource = this.client.factures;
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }

  generatePDF(id: string) {
    console.log(id)
    const data = document.getElementById(id);
    html2canvas(data).then(canvas => {
        // Few necessary setting options
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF(); // A4 size page of PDF
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`facture-${this.client.nom}-${this.client.prenom}-${this.datePipe.transform(new Date(), 'dd/MM/yy')}.pdf`); // Generated PDF
    });
  }
}
