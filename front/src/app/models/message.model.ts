export class MessageModel {
    content: string;
    avatar: string;
    expediteur: string;

    constructor(content: string, avatar: string, expediteur: string){
        this.content = content;
        this.avatar = avatar;
        this.expediteur = expediteur;
    }
}
