import {CdkScrollable} from '@angular/cdk/overlay';

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BarModule} from '@fundamental-ngx/core/bar';
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

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    ToolbarComponent,
    TitleComponent,
    ToolbarSpacerDirective,
    InputGroupModule,
    FormsModule,
    ButtonComponent,
    ToolbarItemDirective,
    BusyIndicatorComponent,
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    BarModule,
    TaskComponent
  ]
})
export class TaskListComponent implements OnInit {
  tableRows: any[] = [];
  todoList: any[] = [];
  progressList: any[] = [];
  testingList: any[] = [];
  doneList: any[] = [];
  taskData: TaskInterface = { Name: 'Dupa', Description: 'Dupa blada', Status: 'fikumiku' };
  displayedRows: any[] = [];
  searchTerm = '';
  confirmationReason: string = '';
  myForm: FormGroup = new FormGroup({});
  loading = false;
  task = new TaskComponent();

  constructor(
    private _dialogService: DialogService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.todoList = [
      {
      },
      {
      }
    ];
    this.progressList = [
      {
      }
    ];
    this.testingList = [
      {
      }
    ];
    this.doneList = [
      {
      },
      {
      },
      {
      },
      {
      },
      {
      }
    ];
    this.tableRows = [
      {
        column1: this.task,
        column2: 'Fruit',
        region: 'Virginia'
      },
      {
        column1: 'Banana',
        column2: 'Fruit',
        region: 'Costa Rica'
      },
      {
        column1: 'Kale',
        column2: 'Vegetable',
        region: 'Colorado'
      },
      {
        column1: 'Kiwi',
        column2: 'Fruit',
        region: 'New Zealand'
      }
    ];
    this.displayedRows = this.tableRows;

    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      typeInput: new FormControl(''),
      regionInput: new FormControl('')
    });
  }

  searchInputChanged(event: string): void {
    const filterRows = (row: { [x: string]: string; }): boolean => {
      const keys = Object.keys(row);
      return !!keys.find((key) => row[key].toLowerCase().includes(event.toLowerCase()));
    };

    if (event) {
      this.displayedRows = this.tableRows.filter((row) => filterRows(row));
    } else {
      this.displayedRows = this.tableRows;
    }
  }

  resetSearch(): void {
    this.displayedRows = this.tableRows;
    this.searchTerm = '';
  }

  openDialog(dialog: TemplateRef<any>): void {
    const dialogRef = this._dialogService.open(dialog, {responsivePadding: true});

    dialogRef.afterClosed.subscribe(
      (result) => {
        this.confirmationReason = 'Dialog closed with result: ' + result;
        this.tableRows.push({
          column1: this.myForm.get('nameInput')?.value,
          column2: this.myForm.get('typeInput')?.value,
          region: this.myForm.get('regionInput')?.value
        });
        this.searchInputChanged(this.searchTerm);
        this.myForm.setValue({nameInput: '', typeInput: '', regionInput: ''});
        this._cdr.detectChanges();
      },
      (error) => {
        this.confirmationReason = 'Dialog dismissed with result: ' + error;
        this._cdr.detectChanges();
      }
    );
  }

  createRange(): number[] {
    // return new Array(number);
    return [0,1,2,3,4];
  }

  get maxLength(): number {
    return Math.max(
      this.todoList.length,
      this.progressList.length,
      this.testingList.length,
      this.doneList.length
    );
  }
}
