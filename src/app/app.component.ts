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
            // 14
            let colorList = ['purple', 'red', 'blue', 'green', 'orange', 'brown', 'cyan', 'salmon', 'royalblue', 'olive', 'springgreen', 'slategrey', 'black', 'aqua'];
            let color = tags['color'];

            if (color === null) {
                color = colorList[Math.floor(Math.random() * Math.floor(13))];
                // console.log(color);
            }

            let userName = tags['display-name'];
            // console.log(tags);

            let newMessage = new Message(userName, message, color);
            let number = this.messages.push(newMessage);
            if (this.messages.length > 7) {
                this.messages.shift();
            }
            
            let blinking = setInterval(() => {
                this.messages[number - 1].isNew = !this.messages[number - 1].isNew;
            }, 1000);

            setTimeout(() => {
                clearInterval(blinking);
            }, 15000);
        });
    }
}
