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
        channels: [ 'summit1g' ]
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

            const element = document.querySelector('#bottom');
            element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
            
            let blinking = setInterval(() => {
                this.messages[number - 1].isNew = !this.messages[number - 1].isNew;
            }, 1000);

            setTimeout(() => {
                clearInterval(blinking);
            }, 15000);
        });

        this.client.on('subscription', (channel, username, method, message, userstate) => {
            let colorList = ['purple', 'red', 'blue', 'green', 'orange', 'brown', 'cyan', 'salmon', 'royalblue', 'olive', 'springgreen', 'slategrey', 'black', 'aqua'];
            let color = userstate['color'];

            if (color === null) {
                color = colorList[Math.floor(Math.random() * Math.floor(13))];
                // console.log(color);
            }

            let newMessage = new Message('SUBSCRIPTION', userstate['system-msg'], color);
            this.messages.push(newMessage);
        });
    }
}
