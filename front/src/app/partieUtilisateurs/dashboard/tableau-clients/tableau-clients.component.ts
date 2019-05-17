import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ClientModel} from '../../../models/client.model';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Store} from '@ngrx/store';
import {OptionsState} from '../../../shared/stores/options.reducer';

@Component({
    selector: 'app-tableau-clients',
    templateUrl: './tableau-clients.component.html',
    styleUrls: ['./tableau-clients.component.scss']
})
export class TableauClientsComponent implements OnInit {

    @Input() listeClients: ClientModel[];
    displayedColumnsClients: string[] = ['nom', 'nbAchat'];
    dataSourceClients = new MatTableDataSource<ClientModel>();

    @ViewChild(MatPaginator) paginatorClients: MatPaginator;

    constructor() {
    }

    ngOnInit() {
        this.dataSourceClients.data = this.listeClients;
        setTimeout(() => this.dataSourceClients.paginator = this.paginatorClients);
    }

}
