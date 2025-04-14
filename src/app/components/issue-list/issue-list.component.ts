import {ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {IssueInterface} from "../../models/issue/issue.interface";
import {
  ButtonBarComponent,
  ButtonComponent,
  DialogBodyComponent,
  DialogCloseButtonComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTemplateDirective,
  FormControlComponent,
  FormItemComponent,
  FormLabelComponent,
  IconComponent,
  InputGroupComponent,
  ListBylineDirective,
  ListBylineLeftDirective,
  ListBylineRightDirective,
  ListComponent,
  ListContentDirective,
  ListFooterDirective,
  ListItemComponent,
  ListThumbnailDirective,
  ListTitleDirective,
  TitleComponent,
  ToolbarComponent, ToolbarItemDirective,
  ToolbarLabelDirective,
  ToolbarSpacerDirective
} from "@fundamental-ngx/core";
import {ActivatedRoute, Router} from "@angular/router";
import {IssueService} from "../../services/issue-services/issue.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogService} from "@fundamental-ngx/core/dialog";
import {IssueRequestInterface} from "../../models/issue/issueRequest.interface";
import {RequestInterface} from "../../models/request/request.interface";
import {RequestService} from "../../services/request-services/request.service";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {WebSocketService} from "../../services/webSocket/web-socket.service";
import {debounceTime} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [
    ListComponent,
    ListItemComponent,
    ListThumbnailDirective,
    ListContentDirective,
    ListTitleDirective,
    ListBylineDirective,
    ListBylineLeftDirective,
    ListBylineRightDirective,
    IconComponent,
    ListFooterDirective,
    ButtonComponent,
    ToolbarComponent,
    ToolbarSpacerDirective,
    InputGroupComponent,
    FormsModule,
    ButtonBarComponent,
    DialogBodyComponent,
    DialogCloseButtonComponent,
    DialogComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    FormControlComponent,
    FormItemComponent,
    FormLabelComponent,
    ReactiveFormsModule,
    TitleComponent,
    DialogTemplateDirective,
    NavigationBarComponent,
    ToolbarItemDirective,
    DatePipe,
  ],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.scss'
})
export class IssueListComponent implements OnInit, OnChanges {
  private webSocketService: WebSocketService | undefined;
  displayedIssues: IssueInterface[] = [];
  issues: IssueInterface[] = [];
  searchTerm: string = '';
  productId: number = -1;
  requestId: number = -1;
  requestName: string = '';
  myForm!: FormGroup;
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;

  constructor(private router: Router,
              private issueService: IssueService,
              private requestService: RequestService,
              private _cdr: ChangeDetectorRef,
              private _dialogService: DialogService,
              private _fb: FormBuilder,
              private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.productId = navigation.extras.state['productId'];
    }
    this.route.params.subscribe((params) => {
      this.requestId = params['id'];
    });
  }


  ngOnInit(): void {
   this.fetchData();
   this.webSocketService = new WebSocketService('/issues');
   this.handleSearchTermChange('');
    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      productManagerInput: new FormControl('')
    });
    console.log(this.productId);
    this.webSocketService.taskListUpdates$.subscribe((listId: number) => {
      debounceTime(500);
      if (listId == this.requestId) {
        this.updateData();
      }
    });
  }

  ngOnChanges(): void {
    this.handleSearchTermChange(this.searchTerm);
  }

  fetchData(): void {
    this.issueService.getIssues(this.requestId).subscribe((issues: IssueInterface[]) => {
      this.issues = issues;
      this.displayedIssues = issues;
    });
    this.requestService.getRequestById(this.requestId).subscribe((request: RequestInterface) => {
      this.requestName = request.name;
    });
  }

  updateData(): void {
    this.issueService.getIssues(this.requestId).subscribe((issues: IssueInterface[]) => {
      this.issues = issues;
      this.displayedIssues = issues;
    });
  }


  navigateToTaskList(issueId: number): void {
    this.router.navigate(['/task-list', issueId], {
      state: { requestId: this.requestId, productId: this.productId }
    });
  }

  abandonIssue(issueId: number): void {
    this.issueService.abandonIssue(issueId).subscribe(() => {
      this.fetchData();
      this._cdr.detectChanges();
    });
  }

  closeIssue(issueId: number): void {
    this.issueService.closeIssue(issueId).subscribe(() => {
      this.fetchData();
      this._cdr.detectChanges();
    });
  }

  protected handleSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.displayedIssues = this.issues.filter((issue) =>
      issue.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
  }

  addIssue(dialog: TemplateRef<any>): void {
    const dialogRef = this._dialogService.open(dialog, {responsivePadding: false, resizable: true});

    dialogRef.afterClosed.subscribe(() => {
      this._cdr.detectChanges();
      const issueRequest: IssueRequestInterface = {
        name: this.myForm.value.nameInput,
        description: this.myForm.value.descriptionInput,
        productManager: this.myForm.value.productManagerInput,
      };
      console.log(issueRequest);
      this.issueService.addIssue(issueRequest, this.requestId).subscribe((issue) => {
        this.fetchData();
        this._cdr.detectChanges();
      });
    }, (error) => {
      this._cdr.detectChanges();
    });
  }
}
