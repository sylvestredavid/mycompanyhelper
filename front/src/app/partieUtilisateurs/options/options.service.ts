import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OptionModel} from '../../models/option.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class OptionsService {

    private options: OptionModel;

    options$ = new BehaviorSubject<OptionModel>(this.options);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }

    private getOptionSite(): Observable<OptionModel> {
        return this.http.get<OptionModel>(this.requeteUtils.url + 'option?idUser=' + this.userService.idUser,
            this.requeteUtils.getOptions());
    }

    publishOptions() {
        this.getOptionSite().subscribe(
            options => {
                this.options = options;
                this.options$.next(this.options);
            }
        );
    }

    updateOptions(option: OptionModel): Observable<OptionModel> {
        return this.http.post<OptionModel>(this.requeteUtils.url + 'option/modif', option, this.requeteUtils.getOptions());
    }
}
