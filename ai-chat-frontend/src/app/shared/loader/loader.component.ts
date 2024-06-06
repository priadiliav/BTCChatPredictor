import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: 
  `
    <div class="loader p-0" [ngStyle]="{'width.px': size, 'height.px': size}">
      <svg viewBox="0 0 50 50" [attr.width]="size" [attr.height]="size">
        <circle class="ring" cx="25" cy="25" r="20" />
        <circle class="ball" cx="25" cy="5" [attr.fill]="color" r="3.5" />
      </svg>
    </div>
  `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Input() size: number = 30;
  @Input() color: string = '#09f';
}
