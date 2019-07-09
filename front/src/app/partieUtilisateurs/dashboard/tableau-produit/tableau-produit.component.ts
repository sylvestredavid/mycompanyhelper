import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ProduitModel} from '../../../models/produit.model';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-tableau-produit',
    templateUrl: './tableau-produit.component.html',
    styleUrls: ['./tableau-produit.component.scss']
})
export class TableauProduitComponent implements OnInit {

    @Input() listeProduits: ProduitModel[];
    displayedColumnsProduits: string[] = ['designation', 'quantite'];
    dataSourceProduit = new MatTableDataSource<ProduitModel>();


    @ViewChild(MatPaginator) paginatorProduits: MatPaginator;


    constructor() {
    }

    ngOnInit() {
        this.dataSourceProduit.data = this.listeProduits;
        setTimeout(() => this.dataSourceProduit.paginator = this.paginatorProduits
        );
    }
}
