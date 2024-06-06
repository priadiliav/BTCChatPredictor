import { Component, OnInit, makeStateKey } from '@angular/core';
import { MessageService } from './services/message.service';
import { IMessage, IResponse } from './models/message.model';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  providers: [MessageService],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  startedResponse: IResponse = {
    title: "Start",
    text: "start",
    loaded: false
  };
  
  
  messages: IMessage[] = [];
  private messagesSubscription!: Subscription;
  constructor(private messageService: MessageService){}
  
  ngOnInit(): void {
    this.messagesSubscription = this.messageService.getMessages().subscribe(messages => {
      this.messages = messages;
    });
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }
}
