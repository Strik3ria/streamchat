import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgxAutoScroll } from 'ngx-auto-scroll';
import * as tmi from 'tmi.js';

import { Message } from './models/message';
import { User } from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    // options = {
    //     params: new HttpParams()
    //         .set('client-d', 'bdblh48f4ivnpta5x210cq5myxtiyp')
    //         .set('Authorization', 'Bearer zo4e361dor3dw8qixofl8yvnzvg1hl'),
    //     responseType: 'application/json'
    // }
    // @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;
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
            let color = tags['color'];
            let userName = tags['display-name'];
            console.log(tags);

            let newMessage = new Message(userName, message, color);
            let number = this.messages.push(newMessage);

            let blinking = setInterval(() => {
                this.messages[number - 1].isNew = !this.messages[number - 1].isNew;
            }, 1000);

            window.scrollTo(window.innerWidth + 200, window.innerHeight + 200);

            setTimeout(() => {
                clearInterval(blinking);
            }, 15000);
        });

        // setInterval(() => {

        // }, 5000);
    }
}
