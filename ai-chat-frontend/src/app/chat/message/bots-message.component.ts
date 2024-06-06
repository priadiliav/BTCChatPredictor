import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { IResponse } from '../models/message.model';
import { MessageService } from '../services/message.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-bots-message',
  templateUrl: './bots-message.component.html',
  styleUrls: ['./bots-message.component.css']
})
export class BotsMessageComponent implements OnChanges, OnDestroy{
  @Input() responseId!: number;
  
  private responseSubscription?: Subscription;
  response?: IResponse;
  
  needTyping = false;
  isTitleTyped = false;

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['responseId']) {
      this.loadResponse();
    }
  }

  loadResponse(): void {
    this.responseSubscription?.unsubscribe();
    
    this.responseSubscription = this.messageService
    .getResponseById(this.responseId).subscribe(response => {
      if (response) {
        this.response = response;
        if (!response.loaded) {
          this.messageService.loadResponse(this.responseId);
          this.needTyping = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.responseSubscription?.unsubscribe(); 
  }
  
  onTitleTyped(): void {
    this.isTitleTyped = true;
  }
}