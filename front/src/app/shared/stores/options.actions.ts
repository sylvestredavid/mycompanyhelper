import {Action} from '@ngrx/store';
import {OptionModel} from '../../models/option.model';

export const GET_OPTIONS = 'get_options';

/**
 * enregistre un objet option dans le store
 */
export class GetOptions implements Action{
    readonly type = GET_OPTIONS;

    constructor(public payload: OptionModel) {}
}

export type OptionsActions = GetOptions;
