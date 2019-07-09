import {HttpHeaders} from '@angular/common/http';
import { Inject } from '@angular/core';


export class RequeteUtils {

    // url = 'https://back.mycompanyhelper.com/api/';
   url = 'http://localhost:5000/api/'
 constructor() {}



    /**
     * options a envoyé dans le header de la requette
     */
    getOptions() {
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('token') || localStorage.getItem('token')
        };

        const requestOptions = {
            headers: new HttpHeaders(headerDict),
        };

        return requestOptions;
    }
}
