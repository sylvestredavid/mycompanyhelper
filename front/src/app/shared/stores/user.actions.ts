import {UserModel} from '../../models/user.modele';
import {Action} from '@ngrx/store';

export const AJOUT_USER = 'ajout_user';
export const DELETE_USER = 'delete_user';

/**
 * enregistre un user dans le store
 */
export class AjoutUser implements Action{
   readonly type = AJOUT_USER;

   constructor(public payload: UserModel) {}
}

/**
 * supprime l'user du store
 */
export class DeleteUser implements Action{
   readonly type = DELETE_USER;

}

export type UserActions = AjoutUser | DeleteUser;

