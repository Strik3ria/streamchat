import { Component } from '@angular/core';
import * as tmi from 'tmi.js';

import { Message } from './models/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'streamchat';
    
    client = tmi.Client({
        connection: {
            reconnect: true,
            secure: true
        },
        channels: [ 'billsellers5' ]
    });

    messages: Message[] = [];

    constructor() {}

    async ngOnInit(): Promise<void> {
        await this.client.connect();

        this.client.on('message', (channel, tags, message, self) => {
            let newMessage = new Message(tags['display-name'], message);
            this.messages.push(newMessage);

            setInterval(() => {
                newMessage.isNew = false;
            }, 15000);
        });
    }
}
