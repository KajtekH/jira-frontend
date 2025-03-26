
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit, TemplateRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BarModule} from '@fundamental-ngx/core/bar';
import { DragAndDropModule } from '@fundamental-ngx/cdk/utils';
import {BusyIndicatorComponent} from '@fundamental-ngx/core/busy-indicator';
import {DialogModule, DialogService} from '@fundamental-ngx/core/dialog';
import {InputGroupModule} from '@fundamental-ngx/core/input-group';
import {TableModule} from '@fundamental-ngx/core/table';
import {TitleComponent} from '@fundamental-ngx/core/title';
import {ToolbarComponent, ToolbarItemDirective, ToolbarSpacerDirective} from '@fundamental-ngx/core/toolbar';
import {TaskComponent} from "../task/task.component";
import {TaskInterface} from "../../models/task.interface";
import {MoveTaskRequest} from "../../models/moveTaskRequest.interface";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  CdkDropList,
  CdkDropListGroup,

  transferArrayItem
} from "@angular/cdk/drag-drop";
import {
  FlexibleColumnLayout,
  FlexibleColumnLayoutComponent,
  ListComponent,
  FlexibleColumnLayoutModule,
  ButtonComponent,
  FormItemComponent,
  FormLabelComponent,
  FormControlComponent
} from "@fundamental-ngx/core";
import {TaskDetailsComponent} from "../task-details/task-details.component";
import {TaskService} from "../../services/task.service";
import {TaskRequest} from "../../models/taskRequest.interface";
import {NgIf} from "@angular/common";
import {forkJoin} from "rxjs";

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
    InputGroupModule,
    FormsModule,
    BusyIndicatorComponent,
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    BarModule,
    TaskComponent,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    ListComponent,
    FlexibleColumnLayoutComponent,
    FlexibleColumnLayoutModule,
    TaskDetailsComponent,
    ToolbarSpacerDirective,
    ButtonComponent,
    ToolbarItemDirective,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    NgIf,
  ]
})
export class TaskListComponent implements OnInit {
  issueId: number = 1;
  todoList: TaskInterface[] = [];
  progressList: TaskInterface[]  = [];
  testingList: TaskInterface[]  = [];
  doneList: TaskInterface[]  = [];
  selectedTask: TaskInterface | undefined;

  localLayout: FlexibleColumnLayout = 'OneColumnStartFullScreen';
  showMidColumnControls = this.localLayout.startsWith('Two') || this.localLayout.includes('FullScreen');
  isFullScreen = this.localLayout.includes('FullScreen');
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;
  myForm!: FormGroup;
  isLoading = true;

  constructor(private taskService: TaskService,
    private _dialogService: DialogService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void  {
    this.fetchData();

    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      typeInput: new FormControl(''),
      assigneeInput: new FormControl('')
    });
  }

  fetchData(): void {
    forkJoin({
      todo: this.taskService.getTasksByStatus('TO_DO'),
      progress: this.taskService.getTasksByStatus('IN_PROGRESS'),
      testing: this.taskService.getTasksByStatus('TESTING'),
      done: this.taskService.getTasksByStatus('DONE')
    }).subscribe(({ todo, progress, testing, done }) => {
      this.todoList = todo;
      this.progressList = progress;
      this.testingList = testing;
      this.doneList = done;
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }


  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const status = this.determineUpdateStatus(event.container.id);
    console.log(status);
    const task = event.item.data as TaskInterface;
    this.moveTask(task.id, status);
      // transferArrayItem(
      //   event.previousContainer.data!,
      //   event.container.data!,
      //   event.previousIndex!,
      //   event.currentIndex!
      // );
    }

  onDragStart(): void {
    const lists = document.querySelectorAll('ul');
    lists.forEach(list => list.classList.add('dragging'));
  }

  onDragEnd(event: CdkDragEnd): void {
    const lists = document.querySelectorAll('ul');
    lists.forEach(list => list.classList.remove('dragging'));

  //  const task = event.source.data as TaskInterface;
  //  console.log(task);
  //  const status = this.determineUpdateStatus(event.event.srcElement!);
  //  console.log(status);
  //  this.moveTask(task, status);
  }

  determineUpdateStatus(id: string): "TO_DO" | "IN_PROGRESS" | "TESTING" | "DONE" {
    if (id === "cdk-drop-list-0") {
      return "TO_DO";
    } else if (id === "cdk-drop-list-1") {
      return "IN_PROGRESS";
    } else if (id === "cdk-drop-list-2") {
      return "TESTING";
    } else if (id === "cdk-drop-list-3") {
      return "DONE";
    }
    return "TO_DO";
  }

  moveTask(id: number, newStatus:  "TO_DO" | "IN_PROGRESS" | "TESTING" | "DONE"): void {
    const taskReq: MoveTaskRequest = {taskId: id, taskStatus: newStatus};
    console.log(taskReq);
    this.taskService.moveTask(taskReq).subscribe(() => {
      this.fetchData();
    });
  }

  changeLayout(newValue: FlexibleColumnLayout, task: TaskInterface) {
    this.localLayout = newValue;
    this.showMidColumnControls = this.localLayout.startsWith('Two') || this.localLayout.includes('FullScreen');
    this.isFullScreen = this.localLayout.includes('FullScreen');
    this.selectedTask = task;
  }


  onLayoutChange(): void {
    this.changeLayout('OneColumnStartFullScreen', this.selectedTask!);
  }

  openDialog(dialog: TemplateRef<any>): void {
    const dialogRef = this._dialogService.open(dialog, { responsivePadding: false, resizable: true });

    dialogRef.afterClosed.subscribe((result) => {
      this._cdr.detectChanges();
      const taskRequest: TaskRequest = {
        name: this.myForm.value.nameInput,
        description: this.myForm.value.descriptionInput,
        assignee: this.myForm.value.assigneeInput,
        type: this.myForm.value.typeInput
      };
      console.log(taskRequest);
      this.taskService.addTask(taskRequest, this.issueId).subscribe((task) => {
        this.fetchData();
      });
    }, (error) => {
      this._cdr.detectChanges();
    });
  }
}
