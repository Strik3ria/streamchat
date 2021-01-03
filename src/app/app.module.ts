import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MessageService } from './services/message.service';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageComponent } from './message-list/message/message.component';

@NgModule({
  declarations: [AppComponent, MessageListComponent, MessageComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
