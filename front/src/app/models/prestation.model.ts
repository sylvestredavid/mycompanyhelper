import {PrestationsFactureModel} from './prestationsFacture.model';

export class PrestationModel {

  id: number;

  designation: string;

  unitee: string;

  prix: number;

  factures?: PrestationsFactureModel[];

  idUser: number;

  tva: number;
}
