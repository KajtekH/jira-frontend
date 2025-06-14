import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {IssueInterface} from "../../models/issue/issue.interface";
import {
  AvatarComponent,
  ButtonBarComponent,
  ButtonComponent, ComboboxComponent,
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
import {HoverDetailsComponent} from "../hover-details/hover-details.component";
import {MessageStripAlertService} from "@fundamental-ngx/core/message-strip";
import {UserService} from "../../services/user-services/user.service";

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [
    ListComponent,
    ListItemComponent,
    ListContentDirective,
    ListTitleDirective,
    ListBylineDirective,
    ListBylineLeftDirective,
    ListBylineRightDirective,
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
    AvatarComponent,
    HoverDetailsComponent,
    ComboboxComponent,
  ],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.scss'
})
export class IssueListComponent implements OnInit, OnChanges, OnDestroy {
  private webSocketService: WebSocketService | undefined;
  displayedIssues: IssueInterface[] = [];
  issues: IssueInterface[] = [];
  searchTerm: string = '';
  productId: number = -1;
  requestId: number = -1;
  requestName: string = '';
  myForm!: FormGroup;
  resultForm!: FormGroup;
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;
  managers: String[] = [];
  issueTypes: string[] = ['ERROR', 'CRITICAL_ERROR', 'CHANGE', 'FEATURE'];

  constructor(private router: Router,
              private issueService: IssueService,
              private requestService: RequestService,
              private userService: UserService,
              private _cdr: ChangeDetectorRef,
              private _dialogService: DialogService,
              private _fb: FormBuilder,
              private messageStripAlertService: MessageStripAlertService,
              private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.productId = navigation.extras.state['productId'];
    }
    this.route.params.subscribe((params) => {
      this.requestId = params['id'];
    });
    this.userService.getUsersByRole('PRODUCT_MANAGER').subscribe((managers: String[]) => {
      this.managers = managers;
      this._cdr.detectChanges();
    });
  }


  ngOnInit(): void {
   this.fetchData();
   this.webSocketService = new WebSocketService('/issues');
   this.handleSearchTermChange('');
    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      issueTypeInput: new FormControl(''),
      productManagerInput: new FormControl('')
    });
    this.resultForm = this._fb.group({
      resultInput: new FormControl('')
    });    console.log(this.productId);
    this.webSocketService.updates$.subscribe((listId: number) => {
      debounceTime(500);
      if (listId == this.requestId) {
        this.updateData();
      }
    });
  }

  ngOnDestroy(): void {
    this.webSocketService?.updates$.unsubscribe();
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


  protected handleSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.displayedIssues = this.issues.filter((issue) =>
      issue.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
  }

  addIssue(dialog: TemplateRef<any>): void {
      const dialogRef = this._dialogService.open(dialog, {
        responsivePadding: false,
        resizable: true,
        width: '800px',
        minWidth: '600px',
        maxWidth: '1000px',
        minHeight: '400px',
        height: '500px',
        draggable: true
      });

    dialogRef.afterClosed.subscribe(() => {
      this._cdr.detectChanges();
      const issueRequest: IssueRequestInterface = {
        name: this.myForm.value.nameInput,
        description: this.myForm.value.descriptionInput,
        issueType: this.myForm.value.issueTypeInput,
        productManager: this.myForm.value.productManagerInput,
      };
      console.log(issueRequest);
      this.issueService.addIssue(issueRequest, this.requestId).subscribe((issue) => {
        this.fetchData();
        this._cdr.detectChanges();
      }, (error) => {
          this._cdr.detectChanges();
          this.showErrorMessage(error.error.message);
        }
      );
    });
  }

  getTypeIcon(issueType: string): string {
    switch (issueType) {
      case 'ERROR':
        return 'status-error';
      case 'CRITICAL_ERROR':
        return 'status-critical';
      case 'CHANGE':
        return 'synchronize';
      case 'FEATURE':
        return 'lab';
      default:
        return 'lab';
    }
  }

  showErrorMessage(message: string): void {
    this.messageStripAlertService.open({
      content: message,
      position: `top-middle`,
      closeOnNavigation: true,
      messageStrip: {
        duration: 2000,
        mousePersist: true,
        type: 'error',
        dismissible: true,
        onDismiss: () => {
          console.log('dismissed');
        }
      }
    });
  }

  abandonIssue(id: number, dialog: TemplateRef<any>) {
    const dialogRef = this._dialogService.open(dialog, {
      responsivePadding: true,
      width: '500px',
      minHeight: '200px',
      draggable: true
    });

    dialogRef.afterClosed.subscribe((result) => {
      if (result === 'apply') {
        const comment = this.resultForm.value.resultInput;
        console.log(comment);
        this.issueService.abandonIssue(id, comment).subscribe(() => {
          this.fetchData();
          this._cdr.detectChanges();
          this.resultForm.reset();
        }, (error) => {
          this._cdr.detectChanges();
          this.showErrorMessage(error.error.message);
        });
      }
    });
  }

  closeIssue(id: number, dialog: TemplateRef<any>) {
    const dialogRef = this._dialogService.open(dialog, {
      responsivePadding: true,
      width: '500px',
      minHeight: '200px',
      draggable: true
    });

    dialogRef.afterClosed.subscribe((result) => {
      if (result === 'apply') {
        const comment = this.resultForm.value.resultInput;
        console.log(comment);
        this.issueService.closeIssue(id, comment).subscribe(() => {
          this.fetchData();
          this._cdr.detectChanges();
          this.resultForm.reset();
        }, (error) => {
          this._cdr.detectChanges();
          this.showErrorMessage(error.error.message);
        });
      }
    });
  }


}
