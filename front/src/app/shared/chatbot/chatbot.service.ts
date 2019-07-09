import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageModel} from '../../models/message.model';

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {

    private messages: MessageModel[] = [];
    messages$ = new BehaviorSubject<MessageModel[]>(this.messages);

    private baseURL = 'https://api.dialogflow.com/v1/query?v=20150910';
    private token = 'Bearer a3febf7191bb463ba1d96ceb51fe4594';

    constructor(private http: HttpClient) {
    }

    getOptions() {
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': this.token
        };

        const requestOptions = {
            headers: new HttpHeaders(headerDict),
        };

        return requestOptions;
    }

    public getResponse(query: string) {
        let data = {
            query: query,
            lang: 'fr',
            sessionId: '12345'
        };
        return this.http
            .post(`${this.baseURL}`, data, this.getOptions());
    }

    pushMessage(messgae: MessageModel) {
        this.messages.push(messgae);
        this.messages$.next(this.messages)
    }

}
