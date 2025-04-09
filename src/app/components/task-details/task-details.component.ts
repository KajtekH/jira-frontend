import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ButtonComponent, ContentDensityDirective,
  DynamicPageComponent,
  DynamicPageContentComponent,
  DynamicPageHeaderComponent,
  DynamicPageLayoutActionsComponent,
  DynamicPageSubheaderComponent, DynamicPageTitleContentComponent, FormControlComponent, ScrollbarDirective,
  ToolbarComponent
} from "@fundamental-ngx/core";
import {CdkScrollable} from "@angular/cdk/scrolling";
import {NgStyle} from "@angular/common";
import {TaskInterface} from "../../models/task/task.interface";
import {FormsModule} from "@angular/forms";
import { TaskService } from '../../services/task-services/task.service';
import {TaskRequest} from "../../models/task/taskRequest.interface";
import {DynamicPageTitleComponent} from "@fundamental-ngx/platform";

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
    NgStyle,
    FormsModule,
    FormControlComponent,
    ContentDensityDirective,
    DynamicPageTitleContentComponent,
    DynamicPageTitleComponent,
    ScrollbarDirective
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  @Input() TaskData: TaskInterface | undefined;
  @Output() closeTaskDetails = new EventEmitter<boolean>();
  dataChanged = false;

  constructor(private taskService: TaskService) {
  }


  changeLayout(): void {
    this.closeTaskDetails.emit();
  }

  onDescriptionChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.TaskData?.description !== target.value) {
      const taskRequest: TaskRequest = {
        name: this.TaskData!.name,
        description: target.value,
        assignee: this.TaskData!.assignee,
        type: this.TaskData!.type
      }
      this.TaskData!.description = target.value;
      console.log(target.value);
      this.taskService.updateTask(taskRequest, this.TaskData!.id).subscribe();
      this.dataChanged = true;
    }
  }

  onTitleChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (this.TaskData?.name !== target.value) {
      const taskRequest: TaskRequest = {
        name: target.value,
        description: this.TaskData!.description,
        assignee: this.TaskData!.assignee,
        type: this.TaskData!.type
      }
      this.TaskData!.name = target.value;
      console.log(target.value);
      this.taskService.updateTask(taskRequest, this.TaskData!.id).subscribe();
      this.dataChanged = true;
    }
  }
}
