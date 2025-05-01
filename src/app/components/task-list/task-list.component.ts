
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
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
import {debounceTime, forkJoin} from "rxjs";
import {ActivatedRoute, Router} from '@angular/router';
import {IssueService} from "../../services/issue-services/issue.service";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {WebSocketService} from "../../services/webSocket/web-socket.service";

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
    NavigationBarComponent,
  ]
})
export class TaskListComponent implements OnInit, OnDestroy {
  private webSocketService: WebSocketService | undefined;
  issueId: number = 1;
  requestId: number = -1;
  productId: number = -1;
  issueName: string = '';
  todoList: TaskInterface[] = [];
  progressList: TaskInterface[]  = [];
  abandonedList: TaskInterface[]  = [];
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
    private _cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.productId = navigation.extras.state['productId'];
      this.requestId = navigation.extras.state['requestId'];
    }
  }

  ngOnInit(): void  {
    this.route.params.subscribe(params => {
      this.issueId = params['id'];
    });
    this.fetchData();
    console.log("issuename:" + this.issueName);
    this.webSocketService = new WebSocketService('/tasks');
    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      typeInput: new FormControl(''),
      priorityInput: new FormControl(''),
      assigneeInput: new FormControl('')
    });

    this.webSocketService.taskListUpdates$.subscribe((listId: number) => {
      debounceTime(500);
      if (listId == this.issueId) {
        this.isLoading = true;
        this.updateData();
        this._cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.webSocketService?.taskListUpdates$.unsubscribe()
  }

  fetchData(): void {
    forkJoin({
      issue: this.issueService.getIssueById(this.issueId),
      tasks: this.taskService.getAllTasks(this.issueId),
    }).subscribe(({issue, tasks }) => {
      console.log(issue);
      this.issueName = issue.name;
      this.todoList = tasks.openTasks
      this.progressList = tasks.inProgressTasks;
      this.abandonedList = tasks.abandonedTasks;
      this.doneList = tasks.closedTasks;
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }

  updateData(): void {
    this.taskService.getAllTasks(this.issueId).subscribe((response) => {
      this.todoList = response.openTasks;
      this.progressList = response.inProgressTasks;
      this.abandonedList = response.abandonedTasks;
      this.doneList = response.closedTasks;
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

  determineUpdateStatus(id: string): "OPEN" | "IN_PROGRESS" | "ABANDONED" | "CLOSED" {
    const numericId = parseInt(id.split('-').pop()!, 10);
    if (numericId % 4 === 0) {
      return "OPEN";
    } else if (numericId % 4 === 1) {
      return "IN_PROGRESS";
    } else if (numericId % 4 === 2) {
      return "ABANDONED";
    } else if (numericId % 4 === 3) {
      return "CLOSED";
    }
    return "OPEN";
  }

  moveTask(id: number, newStatus:  "OPEN" | "IN_PROGRESS" | "ABANDONED" | "CLOSED"): void {
    const taskReq: MoveTaskRequest = {taskId: id, status: newStatus};
    console.log(taskReq);
    this.taskService.moveTask(taskReq).subscribe(() => {});
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
        type: this.myForm.value.typeInput,
        priority: this.myForm.value.priorityInput
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
