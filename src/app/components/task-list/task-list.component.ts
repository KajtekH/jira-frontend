
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
import {TaskInterface} from "../../models/task/task.interface";
import {MoveTaskRequest} from "../../models/task/moveTaskRequest.interface";
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
import {TaskService} from "../../services/task-services/task.service";
import {TaskRequest} from "../../models/task/taskRequest.interface";
import {NgIf} from "@angular/common";
import {forkJoin} from "rxjs";
import { ActivatedRoute } from '@angular/router';
import {IssueService} from "../../services/issue-services/issue.service";

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
  issueName: string = '';
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
    private issueService: IssueService,
    private _dialogService: DialogService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void  {
    this.route.params.subscribe(params => {
      this.issueId = params['id'];
    });
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
      issue: this.issueService.getIssueById(this.issueId),
      todo: this.taskService.getTasksByStatus(this.issueId, 'TO_DO'),
      progress: this.taskService.getTasksByStatus(this.issueId, 'IN_PROGRESS'),
      testing: this.taskService.getTasksByStatus(this.issueId, 'TESTING'),
      done: this.taskService.getTasksByStatus(this.issueId, 'DONE')
    }).subscribe(({issue, todo, progress, testing, done }) => {
      this.issueName = issue.name;
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
    console.log(event.container.id);
    console.log(status);
    const task = event.item.data as TaskInterface;
    this.moveTask(task.id, status);
    }

  onDragStart(): void {
    const lists = document.querySelectorAll('ul');
    lists.forEach(list => list.classList.add('dragging'));
  }

  onDragEnd(event: CdkDragEnd): void {
    const lists = document.querySelectorAll('ul');
    lists.forEach(list => list.classList.remove('dragging'));
  }

  determineUpdateStatus(id: string): "TO_DO" | "IN_PROGRESS" | "TESTING" | "DONE" {
    const numericId = parseInt(id.split('-').pop()!, 10);
    if (numericId % 4 === 0) {
      return "TO_DO";
    } else if (numericId % 4 === 1) {
      return "IN_PROGRESS";
    } else if (numericId % 4 === 2) {
      return "TESTING";
    } else if (numericId % 4 === 3) {
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
        taskType: this.myForm.value.typeInput
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
