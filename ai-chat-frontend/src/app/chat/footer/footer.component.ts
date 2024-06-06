import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnDestroy{
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.min(10)]),
  });
  questionSubscription ?: Subscription;
  isLoading:boolean = false;

  constructor(private messageService:MessageService){}

  handleSubmitForm() {
    const message = this.messageForm.value.message;
    if(this.messageForm.valid && message){
      const messageId = this.messageService.addMessage(message);
      
      this.questionSubscription = this.messageService
      .getResponseById(messageId).subscribe(response => {
          this.isLoading = !response?.loaded;
      });
      this.messageForm.reset();
    }
  }
  ngOnDestroy(): void {
    this.questionSubscription?.unsubscribe();
  }
}
