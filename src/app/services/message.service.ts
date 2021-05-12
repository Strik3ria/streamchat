import { EventEmitter, Injectable } from '@angular/core';
import * as tmi from 'tmi.js';
import { Message } from '../models/message';

@Injectable()
export class MessageService {
  private client: tmi.Client;
  private bottomElement: Element;
  private messages: Message[] = [];
  newMessage = new EventEmitter<Message[]>();
  private newMessageAudio = new Audio('../assets/audio/Ding-sound-effect.mp3');

  constructor() {
    this.setup();
  }

  private async setup(): Promise<void> {
    this.client = tmi.Client({
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: ['billsellers5'],
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
  }

  private newMessages = () => {
    this.client.on('message', (channel, tags, message, self) => {
      const color = this.getColor(tags);
      const userName = tags['display-name'];

      const newMessage = new Message(userName, message, color);
      this.addMessage(newMessage);
    });
  };

  private newSubscriber = () => {
    this.client.on('subscription', (channel, username, method, message, userstate) => {
      const color = this.getColor(userstate);

      const newMessage = new Message('SUBSCRIPTION', userstate['system-msg'], color);
      this.addMessage(newMessage);
    });
  };

  private resubscriber = () => {
    this.client.on('resub', (channel, username, months, message, userstate, methods) => {
      const color = this.getColor(userstate);

      const newMessage = new Message('RE-SUBSCRIBER', userstate['system-msg'], color);
      this.addMessage(newMessage);
    });
  };

  private subGift = () => {
    this.client.on('subgift', (channel, username, months, recipient, methods, userstate) => {
      const color = this.getColor(userstate);

      const newMessage = new Message('GIFT SUB', userstate['system-msg'], color);
      this.addMessage(newMessage);
    });
  };

  private multiRandomGift = () => {
    this.client.on('submysterygift', (channel, username, numOfSubs, methods, userstate) => {
      const color = this.getColor(userstate);

      const newMessage = new Message('MULTI GIFT SUB', userstate['system-msg'], color);
      this.addMessage(newMessage);
    });
  };

  private giftUpgrade = () => {
    this.client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
      const color = this.getColor(userstate);

      const newMessage = new Message('GIFT SUB UPGRADE', userstate['system-msg'], color);
      this.addMessage(newMessage);
    });
  };

  private hosted = () => {
    this.client.on('hosted', (channel, username, viewers, autohost) => {
      const color = this.getColor(null);
      const message = `${username} has hosted you with ${viewers} of their
			friends!`;

      const newMessage = new Message('HOSTED', message, color);
      this.addMessage(newMessage);
    });
  };

  private addMessage = (message: Message) => {
    const messageIndex = this.messages.push(message);
    this.newMessage.emit(this.messages.slice());
    this.playNewMessageSound();
    this.scrollToBottomElement();

    const blinking = this.getBlinkInterval(messageIndex);
    this.timeoutBlinkAtFifteen(blinking);

    return messageIndex;
  };

  private getColor = (state: any) => {
    const colorList = [
      'purple',
      'red',
      'blue',
      'green',
      'orange',
      'brown',
      'cyan',
      'salmon',
      'royalblue',
      'olive',
      'springgreen',
      'slategrey',
      'black',
      'aqua',
    ];
    let color = state.color;

    if (color === null) {
      color = colorList[Math.floor(Math.random() * Math.floor(13))];
    }

    return color;
  };

  private playNewMessageSound = () => {
    this.newMessageAudio.play();
  };

  private getBlinkInterval = (messageIndex: number) =>
    setInterval(() => {
      this.messages[messageIndex - 1].isNew = !this.messages[messageIndex - 1].isNew;
    }, 1000);

  private timeoutBlinkAtFifteen = (interval: any) => {
    setTimeout(() => {
      clearInterval(interval);
    }, 15000);
  };

  private scrollToBottomElement = () => {
    this.bottomElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };
}
