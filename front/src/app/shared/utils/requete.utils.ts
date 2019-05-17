import {HttpHeaders} from '@angular/common/http';
import { Inject } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

export class RequeteUtils {

    url = 'https://back.mycompanyhelper.com/api/';
 constructor(@Inject(LOCAL_STORAGE) private localStorage: any, ) {}



    /**
     * options a envoyé dans le header de la requette
     */
    getOptions() {
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('token') || this.localStorage.getItem('token')
        };

        const requestOptions = {
            headers: new HttpHeaders(headerDict),
        };

        return requestOptions;
    }
}
