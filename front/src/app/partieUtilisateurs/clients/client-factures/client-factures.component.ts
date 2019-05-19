import {Component, HostListener, Input, OnInit, Inject} from '@angular/core';
import {FactureModel} from '../../../models/facture.model';
import {ClientModel} from '../../../models/client.model';
import {animate, state, style, transition, trigger} from '@angular/animations';


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

  constructor() {
  }

  ngOnInit() {
    this.dataSource = this.client.factures;
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }

}
