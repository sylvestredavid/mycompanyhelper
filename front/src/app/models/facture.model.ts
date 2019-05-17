import {ClientModel} from './client.model';
import {ProduitModel} from './produit.model';
import {ProduitsFactureModel} from './produitsFacture.model';

export class FactureModel {

  idFacture: number;

  date: Date;

  total: number;

  client: ClientModel;

  produitsFacture: ProduitsFactureModel[];

  idUser: number;
}
