import {GenreModel} from './genre.model';
import {ProduitsFactureModel} from './produitsFacture.model';

export class ProduitModel {

  idProduit: number;

  designation: string;

  prixAchat: number;

  prixVente: number;

  quantite: number;

  genre?: GenreModel;

  factures?: ProduitsFactureModel[];

  idUser: number;

  enVente: boolean;

  tva: number;

  seuilStockBas: number;
}
