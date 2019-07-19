import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EmailModel} from '../../models/email.model';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class MailingService {

    constructor(private http: HttpClient, private requeteUtils: RequeteUtils) {
    }

    sendMail(mail: EmailModel) {
        return this.http.post(this.requeteUtils.url + 'annuaireFournisseur/sendMail', mail);
    }
}
