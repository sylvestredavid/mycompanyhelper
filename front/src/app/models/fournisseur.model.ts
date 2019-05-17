import {GenreModel} from './genre.model';

export class FournisseurModel {

    idFournisseur: number;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    codePostal: string;
    ville: string;
    categories: GenreModel[];

    idUser: number;
}
