export class AnnonceModel {

    id?: number;

    titre: string;

    corps: string;

    resumer: string;

    image: string;

    prixMin: number;

    prixMax: number;

    email: string;

    categories: string;

    idFournisseur: number;

    nbContacts: number;

    misEnAvant: boolean;

    datePoste?: string;
}
