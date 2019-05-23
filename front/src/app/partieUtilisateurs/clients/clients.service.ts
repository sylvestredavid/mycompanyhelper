import {Injectable} from '@angular/core';
import {ClientModel} from '../../models/client.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {

    private listeClients: ClientModel[];

    listeClients$ = new BehaviorSubject<ClientModel[]>(this.listeClients);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }

    private getClients(): Observable<ClientModel[]> {
        return this.http.get<ClientModel[]>(this.requeteUtils.url + 'clients?idUser=' + this.userService.idUser, this.requeteUtils.getOptions());
    }

    publishClients() {
        this.getClients().subscribe(
            clients => {
                this.listeClients = clients;
                this.listeClients$.next(this.listeClients);
            }
        );
    }

    getClient(id: number): Observable<ClientModel> {
        return this.http.get<ClientModel>(this.requeteUtils.url + 'clients/' + id, this.requeteUtils.getOptions());
    }

    saveClient(client: ClientModel) {
        return this.http.post<ClientModel>(this.requeteUtils.url + 'clients/save', client, this.requeteUtils.getOptions());
    }

    modifClient(client: ClientModel) {
        return this.http.post<ClientModel>(this.requeteUtils.url + 'clients/save', client, this.requeteUtils.getOptions());
    }

    deleteClient(id: number) {
        const url = this.requeteUtils.url + 'clients/delete?id=' + id;
        return this.http.delete(url, this.requeteUtils.getOptions());
    }

    pushClient(newClient) {
        let dejaExistant = false;
        this.listeClients.forEach(
            client => {
                if (client.idClient === newClient.idClient) {
                    dejaExistant = true;
                    return;
                }
            }
        );
        if (!dejaExistant) {
            this.listeClients.push(newClient);
            this.listeClients$.next(this.listeClients);
        }
    }

    replaceClient(client) {
        const index = this.listeClients.findIndex(clients => {
            if (clients.idClient === client.idClient) {
                return true;
            }
        });
        this.listeClients[index] = client;
        this.listeClients$.next(this.listeClients);
    }

    removeClient(id: number) {
        const index = this.listeClients.findIndex(clients => {
            if (clients.idClient === id) {
                return true;
            }
        });
        this.listeClients.splice(index, 1);
        this.listeClients$.next(this.listeClients);
    }
}
