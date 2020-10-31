import { EventEmitter, Injectable } from '@angular/core';
import { Message } from '../models/message';
import * as tmi from 'tmi.js';

@Injectable()
export class MessageService {
    client: tmi.Client;

    constructor() {
        this.client = tmi.Client({
            connection: {
                reconnect: true,
                secure: true
            },
            channels: [ 'billsellers5' ]
        });

        this.setup();
    }
    
    messages: Message[] = [];
    newMessage = new EventEmitter<Message[]>();

    getMessages(): Message[] {
        return this.messages.slice();
    }

    async setup() {
        await this.client.connect()
    }

    newMessages = () => {
        this.client.on('message', (channel, tags, message, self) => {
            let color = this.getColor(tags);
            let userName = tags['display-name'];

            let newMessage = new Message(userName, message, color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();
            
            let blinking = this.getNewInterval(number);
            this.timeoutAtFifteen(blinking);
        });
    }

    newSubscriber = () => {
        this.client.on('subscription', (channel, username, method, message, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('SUBSCRIPTION', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getNewInterval(number);
            this.timeoutAtFifteen(blinking);
        });
    }

    resubscriber = () => {
        this.client.on('resub', (channel, username, months, message, userstate, methods) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('RE-SUBSCRIBER', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getNewInterval(number);
            this.timeoutAtFifteen(blinking);
        });
    }

    subGift = () => {
        this.client.on('subgift', (channel, username, months, recipient, methods, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('GIFT SUB', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getNewInterval(number);
            this.timeoutAtFifteen(blinking);
        });
    }

    subMysterGift = () => {
        this.client.on('submysterygift', (channel, username, numOfSubs, methods, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('MULTI GIFT SUB', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getNewInterval(number);
            this.timeoutAtFifteen(blinking);
        });
    }

    giftUpgrade = () => {
        this.client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('GIFT SUB UPGRADE', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getNewInterval(number);
            this.timeoutAtFifteen(blinking);
        });
    }

    hosted = () => {
        this.client.on('hosted', (channel, username, viewers, autohost) => {
            let color = this.getColor(null);
            let message = `${username} has hosted you with ${viewers} of their friends!`;

            let newMessage = new Message('HOSTED', message, color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getNewInterval(number);
            this.timeoutAtFifteen(blinking);
        });
    }

    addMessage = (message: Message) => {
        let number = this.messages.push(message);
        this.newMessage.emit(this.messages.slice());
        
        return number;
    }

    getColor = (state) => {
        let colorList = ['purple', 'red', 'blue', 'green', 'orange', 'brown', 'cyan', 'salmon', 'royalblue', 'olive', 'springgreen', 'slategrey', 'black', 'aqua'];
        let color = state['color'];

        if (color === null) {
            color = colorList[Math.floor(Math.random() * Math.floor(13))];
        }

        return color;
    }

    getNewInterval = (number: number) => setInterval(() => {
        this.messages[number - 1].isNew = !this.messages[number - 1].isNew;
    }, 1000);

    timeoutAtFifteen = (interval: any) => {
        setTimeout(() => {
            clearInterval(interval);
        }, 15000);
    };

    scrollToBottomElement = () => {
        const element = document.querySelector('#bottom');
        element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }
}