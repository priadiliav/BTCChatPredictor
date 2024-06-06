import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutoScroll]'
})
export class AutoScrollDirective implements AfterViewInit {
  private mutationObserver: MutationObserver;
  constructor(private element: ElementRef) {
    this.mutationObserver = new MutationObserver(mutations => {
      this.scrollToBottom();
    });
  }
  ngAfterViewInit(): void {
    this.mutationObserver.observe(this.element.nativeElement, {
      childList: true,
      subtree: true
    });
    this.scrollToBottom(); 
  }
  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
  }
  scrollToBottom(): void {
    const element = this.element.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}