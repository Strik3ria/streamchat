import { Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import * as tmi from 'tmi.js';

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
        channels: [ 'penta' ]
    });

    messages: string[] = [];

    constructor() {}

    async ngOnInit(): Promise<void> {
        await this.client.connect();

        this.client.on('message', (channel, tags, message, self) => {
            this.messages.push(`${tags['display-name']}: ${message}`);
        });
    }

}
