import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatComponent } from './chat/chat.component';
import { LandingComponent } from './landing/landing.component';
import { FooterComponent } from './chat/footer/footer.component';
import { HeaderComponent } from './chat/header/header.component';
import { TypewriterDirective } from './directives/typewriter.directive';
import { CustomersMessageComponent } from './chat/message/customers-message.component';
import { BotsMessageComponent } from './chat/message/bots-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoScrollDirective } from './directives/autoscroll.directive';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './shared/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LandingComponent,
    CustomersMessageComponent,
    BotsMessageComponent,
    FooterComponent,
    HeaderComponent,
    TypewriterDirective,
    AutoScrollDirective,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
