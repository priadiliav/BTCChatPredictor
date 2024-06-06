import { Injectable } from "@angular/core";
import { IMessage, IQuestion, IResponse } from "../models/message.model";
import { BehaviorSubject, Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: "root"})
export class MessageService {
    
    private apiUrl = 'http://localhost:5001';  // Ensure this matches your Flask server URL

    private messages: IMessage[] = [
        {
            id: 1,
            question: undefined,
            response: {
                title:  "Bring your finance to life with AI",
                text: "Get started faster with the help of AI. Tell us about yourself and get personalized tools, images, and text for your site.",
                loaded: true
            },
        },
    ];

    constructor(private http: HttpClient) {}

    private messagesSubject = new BehaviorSubject<IMessage[]>(this.messages);

    getMessages() {
        return this.messagesSubject.asObservable();
    }

    getResponseById(id: number): Observable<IResponse | undefined> {
        return this.messagesSubject.pipe(map(messages => messages.find(message => message.id === id)?.response));
    }

    getQuestionById(id: number): Observable<IQuestion | undefined> {
        return this.messagesSubject.pipe(map(messages => messages.find(message => message.id === id)?.question));
    }

    loadResponse(id: number): void {
        const message = this.messages.find(msg => msg.id === id);
        if (message && !message.response.loaded) {
            this.http.post<any>(`${this.apiUrl}/chat`, { message: message.question?.text })
                .subscribe(response => {
                    message.response.title = "Question about BTC";
                    message.response.text = response.response;
                    message.response.loaded = true;
                    this.messagesSubject.next(this.messages);
                }, error => {
                    console.error('Error loading response', error);
                    console.error('Error details', error.message, error.status, error.statusText, error.url);
                });
        }
    }

    addMessage(text: string): number {
        const newMessage: IMessage = {
            id: this.messages.length + 1,
            question: {
                text: text,
                date: new Date().toLocaleDateString(),
                user: "Vitalii" 
            },
            response: {
                title: "",
                text: "",
                loaded: false
            },
        };
        this.messages.push(newMessage);
        
        this.messagesSubject.next(this.messages);
        return newMessage.id;
    }
}