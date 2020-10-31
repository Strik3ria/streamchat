import { Component } from '@angular/core';

import { Message } from './models/message';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'streamchat';
    messages: Message[] = [];

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.messageService.newMessages();
        this.messageService.newSubscriber();
        this.messageService.resubscriber();
        this.messageService.subGift();
        this.messageService.subMysterGift();
        this.messageService.giftUpgrade();
        this.messageService.hosted();

        this.messageService.newMessage.subscribe(
            (messages: Message[]) => {
                this.messages = messages;
            }
        )
    }
}
