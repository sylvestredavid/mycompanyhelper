import {FournisseurAnnuaireModel} from './fournisseurAnnuaire.model';

export const FOURNISSEURS_ANNUAIRE: FournisseurAnnuaireModel[] = [
    {
        id: 1,
        nom: 'Les pierres d\'alice',
        adresse: '13 rue des champs',
        codePostal: '33000',
        ville: 'Bordeaux',
        email: 'pierres.alice@gmail.com',
        image: 'pierresAlice.png',
        telephone: '0553579267',
        prixMin: 1.49,
        prixMax: 8.99,
        description: 'Grand choix de pierres et de mineraux.'
    },{
        id: 2,
        nom: 'Ca sent bon',
        adresse: '1 rue des rose',
        codePostal: '24000',
        ville: 'Perigueux',
        email: 'ca-sent-bon@gmail.com',
        image: 'caSentBon.png',
        telephone: '0689790806',
        prixMin: 0.99,
        prixMax: 6.99,
        description: 'Chez nous, tout les encens ils sentent top bon.'
    },

]
