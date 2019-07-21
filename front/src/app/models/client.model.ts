import {FactureModel} from './facture.model';

export class ClientModel {

  idClient: number;

  nom: string;

  prenom: string;

  email: string;

  telephone: string;

  adresse: string;

  codePostal: string;

  ville: string;

  factures: FactureModel[];

  idUser: number;

  panierMoyen?: number;
}
