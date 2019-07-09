import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MessageModel} from '../../../models/message.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ChatbotService} from '../chatbot.service';
import {MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, AfterViewChecked {

    messages: MessageModel[];
    messageForm: FormGroup;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private fb: FormBuilder, private chatBotService: ChatbotService,
                private dialogRef: MatDialogRef<MessageListComponent>, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'sortie',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/delete.svg'));
    }

    ngOnInit() {
        this.chatBotService.pushMessage(new MessageModel('Bonjour, que voulez-vous faire?', 'assets/bot.png', 'bot'));
        this.chatBotService.messages$.subscribe(
            msg => this.messages = msg
        );
        this.messageForm = this.fb.group({
            message: ''
        });
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    /**
     * methode qui scroll vers le bas a chaque envois et reception de message afin que le dernier message soit toujours visible
     */
    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }


    public sendMessage(): void {
        let message = new MessageModel(this.messageForm.value.message, 'assets/user.png', 'user');
        this.chatBotService.pushMessage(message);
        this.messageForm.reset();
        this.chatBotService.getResponse(message.content).subscribe((res: any) => {
            this.chatBotService.pushMessage(
                new MessageModel(res.result.fulfillment.speech, 'assets/bot.png', 'bot')
            );
        });
    }

    close() {
        this.dialogRef.close();
    }
}

