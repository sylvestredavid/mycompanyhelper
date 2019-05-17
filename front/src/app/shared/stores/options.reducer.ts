import {OptionModel} from '../../models/option.model';
import {GET_OPTIONS, OptionsActions} from './options.actions';

/**
 * methode qui dispatche les actions a l'aide d'un switch
 * suivant l'action choisie, elle va effectué un traitement sur le store
 * @param state optionModel
 * @param action optionsActions
 */
export function optionsReducer(state: OptionModel, action: OptionsActions) {


    switch (action.type) {

        case GET_OPTIONS:
            return [state = action.payload];
        default:
            return state;

    }
}

export interface OptionsState {
    readonly options: OptionModel;
}
