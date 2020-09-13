import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxAutoScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
