import { Component } from '@angular/core';
import * as tmi from 'tmi.js';

import { Message } from './models/message';
import { User } from './models/user';

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
    users: User[] = [];

    constructor() {}

    async ngOnInit(): Promise<void> {
        await this.client.connect();

        this.client.on('message', (channel, tags, message, self) => {
            let color = '';
            if (!this.users.filter(x => x.userName === tags['display-name'])[0]) {
                let newUser = new User(tags['display-name']);
                this.users.push(newUser);
                color = newUser.color;
            } else {
                color = this.users.filter(x => x.userName === tags['display-name'])[0].color
            }

            let newMessage = new Message(tags['display-name'], message, color);
            this.messages.push(newMessage);

            setInterval(() => {
                newMessage.isNew = false;
            }, 15000);
        });
    }
}
