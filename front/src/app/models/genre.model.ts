import {ProduitModel} from './produit.model';

export class GenreModel {

  idGenre: number;

  designation: string;

  produits: ProduitModel[];

  idUser: number;
}
