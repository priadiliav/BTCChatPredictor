import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appTypewriter]'
})
export class TypewriterDirective implements OnInit {
  @Input() text: string = '';
  @Input() typingSpeed: number = 100;
  @Output() typingCompleted: EventEmitter<void> = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.typeText();
  }

  async typeText() {
    for (let i = 0; i < this.text.length; i++) {
      this.el.nativeElement.innerHTML += this.text[i];
      await this.delay(this.typingSpeed);
    }
    this.typingCompleted.emit(); 
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
