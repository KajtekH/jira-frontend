import {CdkScrollable} from '@angular/cdk/overlay';

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BarModule} from '@fundamental-ngx/core/bar';
import { DragAndDropModule, FdDropEvent } from '@fundamental-ngx/cdk/utils';
import {BusyIndicatorComponent} from '@fundamental-ngx/core/busy-indicator';
import {ButtonComponent} from '@fundamental-ngx/core/button';
import {DialogModule, DialogService} from '@fundamental-ngx/core/dialog';
import {FormControlComponent, FormItemComponent, FormLabelComponent} from '@fundamental-ngx/core/form';
import {InputGroupModule} from '@fundamental-ngx/core/input-group';
import {TableModule} from '@fundamental-ngx/core/table';
import {TitleComponent} from '@fundamental-ngx/core/title';
import {ToolbarComponent, ToolbarItemDirective, ToolbarSpacerDirective} from '@fundamental-ngx/core/toolbar';
import {TaskComponent} from "../task/task.component";
import {TaskInterface} from "../../models/task.interface";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  CdkDropList,
  CdkDropListGroup,

  transferArrayItem
} from "@angular/cdk/drag-drop";
import {ListComponent} from "@fundamental-ngx/core";

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    DragAndDropModule,
    ToolbarComponent,
    TitleComponent,
    ToolbarSpacerDirective,
    InputGroupModule,
    FormsModule,
    BusyIndicatorComponent,
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    BarModule,
    TaskComponent,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    ListComponent,
  ]
})
export class TaskListComponent implements OnInit {
  tableRows: TaskInterface[] = [];
  todoList: TaskInterface[] = [];
  progressList: TaskInterface[] = [];
  testingList: TaskInterface[] = [];
  doneList: any[] = [];
  searchTerm = '';


  ngOnInit(): void {
    this.todoList = [
      {
        Id: 1, Name: 'Task 1', Description: 'Description 1', CreatedAt: '2021-01-01', UpdatedAt: '2021-01-01', Type: 'Type 1', Status: 'Status 1'
      },
      {
        Id: 2, Name: 'Task 2', Description: 'Description 2', CreatedAt: '2021-01-01', UpdatedAt: '2021-01-01', Type: 'Type 2', Status: 'Status 2'
      },
      {
        Id: 3, Name: 'Task 3', Description: 'Description 3', CreatedAt: '2021-01-01', UpdatedAt: '2021-01-01', Type: 'Type 3', Status: 'Status 3'
      },
      {
        Id: 4, Name: 'Task 4', Description: 'Description 4', CreatedAt: '2021-01-01', UpdatedAt: '2021-01-01', Type: 'Type 4', Status: 'Status 4'
      },
      {
        Id: 5, Name: 'Task 5', Description: 'Description 5', CreatedAt: '2021-01-01', UpdatedAt: '2021-01-01', Type: 'Type 5', Status: 'Status 5'
      }
    ];
    this.progressList = [
    ];
    this.testingList = [
      {
        Id: 6, Name: 'Task 6', Description: 'Description 6', CreatedAt: '2021-01-01', UpdatedAt: '2021-01-01', Type: 'Type 6', Status: 'Status 6'
      }
    ];
    this.doneList = [
    ];
  }


  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

  onDragStart(event: CdkDragStart): void {
    const lists = document.querySelectorAll('ul');
    lists.forEach(list => list.classList.add('dragging'));
  }

  onDragEnd(event: CdkDragEnd): void {
    const lists = document.querySelectorAll('ul');
    lists.forEach(list => list.classList.remove('dragging'));
  }
}
