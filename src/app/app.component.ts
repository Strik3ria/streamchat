import { Component, OnInit } from '@angular/core';
import { Message } from './models/message';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'streamchat';
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.newMessage.subscribe((messages: Message[]) => (this.messages = messages));
  }
}
