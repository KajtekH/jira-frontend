import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ButtonComponent,
  DynamicPageComponent,
  DynamicPageContentComponent,
  DynamicPageHeaderComponent,
  DynamicPageLayoutActionsComponent,
  DynamicPageSubheaderComponent,
  ToolbarComponent
} from "@fundamental-ngx/core";
import {CdkScrollable} from "@angular/cdk/scrolling";
import {NgStyle} from "@angular/common";
import {TaskInterface} from "../../models/task/task.interface";

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    ButtonComponent,
    CdkScrollable,
    DynamicPageComponent,
    DynamicPageContentComponent,
    DynamicPageHeaderComponent,
    DynamicPageLayoutActionsComponent,
    DynamicPageSubheaderComponent,
    ToolbarComponent,
    NgStyle
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  @Input() TaskData: TaskInterface | undefined;
  @Output() closeTaskDetails = new EventEmitter<String>();

  changeLayout(): void {
  this.closeTaskDetails.emit();
  }
}
