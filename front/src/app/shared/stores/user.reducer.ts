import {AJOUT_USER, DELETE_USER, UserActions} from './user.actions';
import {UserModel} from '../../models/user.modele';

/**
 * methode qui dispatche les actions a l'aide d'un switch
 * suivant l'action choisie, elle va effectué un traitement sur le store
 * @param state UserModel
 * @param action UserActions
 */
export function userReducer(state: UserModel, action: UserActions) {


    switch (action.type) {

        case AJOUT_USER:
            return [state = action.payload];

        case DELETE_USER:
            return state = null;

        default:
            return state;

    }
}

export interface UserState {
    readonly user: UserModel;
}
