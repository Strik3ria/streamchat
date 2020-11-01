import { EventEmitter, Injectable } from '@angular/core';
import { Message } from '../models/message';
import * as tmi from 'tmi.js';

@Injectable()
export class MessageService {
    client: tmi.Client;
    bottomElement: Element;

    constructor() {
        this.setup();
    };
    
    messages: Message[] = [];
    newMessage = new EventEmitter<Message[]>();
    newMessageAudio = new Audio('../assets/audio/button-50.mp3');

    async setup() {
        this.client = tmi.Client({
            connection: {
                reconnect: true,
                secure: true
            },
            channels: [ 'kyle' ]
        });
        
        await this.client.connect();

        this.newMessages();
        this.newSubscriber();
        this.resubscriber();
        this.subGift();
        this.multiRandomGift();
        this.giftUpgrade();
        this.hosted();

        this.bottomElement = document.querySelector('#bottom');
        this.newMessageAudio.load();
    };

    newMessages = () => {
        this.client.on('message', (channel, tags, message, self) => {
            let color = this.getColor(tags);
            let userName = tags['display-name'];

            let newMessage = new Message(userName, message, color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();
            
            let blinking = this.getBlinkInterval(number);
            this.timeoutBlinkAtFifteen(blinking);
        });
    };

    newSubscriber = () => {
        this.client.on('subscription', (channel, username, method, message, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('SUBSCRIPTION', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getBlinkInterval(number);
            this.timeoutBlinkAtFifteen(blinking);
        });
    };

    resubscriber = () => {
        this.client.on('resub', (channel, username, months, message, userstate, methods) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('RE-SUBSCRIBER', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getBlinkInterval(number);
            this.timeoutBlinkAtFifteen(blinking);
        });
    };

    subGift = () => {
        this.client.on('subgift', (channel, username, months, recipient, methods, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('GIFT SUB', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getBlinkInterval(number);
            this.timeoutBlinkAtFifteen(blinking);
        });
    };

    multiRandomGift = () => {
        this.client.on('submysterygift', (channel, username, numOfSubs, methods, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('MULTI GIFT SUB', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getBlinkInterval(number);
            this.timeoutBlinkAtFifteen(blinking);
        });
    };

    giftUpgrade = () => {
        this.client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
            let color = this.getColor(userstate);

            let newMessage = new Message('GIFT SUB UPGRADE', userstate['system-msg'], color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getBlinkInterval(number);
            this.timeoutBlinkAtFifteen(blinking);
        });
    };

    hosted = () => {
        this.client.on('hosted', (channel, username, viewers, autohost) => {
            let color = this.getColor(null);
            let message = `${username} has hosted you with ${viewers} of their friends!`;

            let newMessage = new Message('HOSTED', message, color);
            let number = this.addMessage(newMessage);

            this.scrollToBottomElement();

            let blinking = this.getBlinkInterval(number);
            this.timeoutBlinkAtFifteen(blinking);
        });
    };

    addMessage = (message: Message) => {
        let number = this.messages.push(message);
        this.newMessage.emit(this.messages.slice());
        this.playNewMessageSound();
        
        return number;
    };

    getColor = (state: any) => {
        let colorList = ['purple', 'red', 'blue', 'green', 'orange', 'brown', 'cyan', 'salmon', 'royalblue', 'olive', 'springgreen', 'slategrey', 'black', 'aqua'];
        let color = state['color'];

        if (color === null) {
            color = colorList[Math.floor(Math.random() * Math.floor(13))];
        }

        return color;
    };

    playNewMessageSound = () => {
        this.newMessageAudio.play();
    };

    getBlinkInterval = (number: number) => setInterval(() => {
        this.messages[number - 1].isNew = !this.messages[number - 1].isNew;
    }, 1000);

    timeoutBlinkAtFifteen = (interval: any) => {
        setTimeout(() => {
            clearInterval(interval);
        }, 15000);
    };

    scrollToBottomElement = () => {
        this.bottomElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    };
}