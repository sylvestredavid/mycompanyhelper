import {ClientModel} from './client.model';
import {ProduitsFactureModel} from './produitsFacture.model';
import {PrestationsFactureModel} from './prestationsFacture.model';

export class FactureModel {

  idFacture?: number;

  date: Date;

  totalHT: number;

  totalTTC: number;

  tva21: number;

  tva55: number;

  tva10: number;

  tva20: number;

  remise: number;

  client: ClientModel;

  produitsFacture: ProduitsFactureModel[];

  prestationsFacture: PrestationsFactureModel[];

  idUser: number;

  numero: number;

  devis: boolean;
}
