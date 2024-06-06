import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { IQuestion } from "../models/message.model";
import { Subscription } from "rxjs";
import { MessageService } from "../services/message.service";

@Component({
  selector: 'app-customers-message',
  templateUrl: './customers-message.component.html',
  styleUrls: ['./customers-message.component.css']
})
export class CustomersMessageComponent implements OnChanges, OnDestroy {
  @Input() messageId!: number;

  private messageSubscription ?: Subscription;
  question ?: IQuestion;

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messageId']) {
      this.loadCustomersMessage();
    }
  }

  loadCustomersMessage(): void {
    this.messageSubscription?.unsubscribe();
    
    this.messageSubscription = this.messageService
    .getQuestionById(this.messageId).subscribe(question => {
      console.log(question);
      if (question) {
        this.question = question;
      }
    });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
