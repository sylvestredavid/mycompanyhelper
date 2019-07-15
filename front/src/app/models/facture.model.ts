import {ClientModel} from './client.model';
import {ProduitsFactureModel} from './produitsFacture.model';

export class FactureModel {

  idFacture?: number;

  date: Date;

  totalHT: number;

  totalTTC: number;

  tva21: number;

  tva55: number;

  tva10: number;

  tva20: number;

  client: ClientModel;

  produitsFacture: ProduitsFactureModel[];

  idUser: number;

  numero: number;
}
