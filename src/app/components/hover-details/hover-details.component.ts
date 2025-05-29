import {Component, Input} from '@angular/core';
import {DatePipe} from "@angular/common";
import { CommonModule } from '@angular/common';
import { PopoverModule } from '@fundamental-ngx/core/popover';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hover-details',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    PopoverModule
  ],
  templateUrl: './hover-details.component.html',
  styleUrl: './hover-details.component.scss'
})
export class HoverDetailsComponent implements OnDestroy{
  @Input() details: any;
  @Input() detailsType: 'product' | 'request' | 'issue' | 'general' = 'general';
  @Input() title: string = '';
  @Input() detailsItems: {label: string, value: any}[] = [];

  private closeTimer: any;
  private closeDelay = 50;

  ngOnDestroy(): void {
    this.clearCloseTimer();
  }

  openPopover(popover: any): void {
    this.clearCloseTimer();
    popover.open();
  }

  startCloseTimer(popover: any): void {
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      popover.close();
    }, this.closeDelay);
  }

  cancelCloseTimer(): void {
    this.clearCloseTimer();
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
