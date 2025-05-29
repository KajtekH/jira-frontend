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
import {
  AvatarComponent,
  ButtonBarComponent,
  ButtonComponent,
  DialogBodyComponent,
  DialogCloseButtonComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent, DialogTemplateDirective,
  FormControlComponent,
  FormItemComponent,
  FormLabelComponent,
  IconComponent,
  InputGroupComponent,
  ListBylineDirective,
  ListComponent,
  ListContentDirective,
  ListFooterDirective,
  ListItemComponent,
  ListThumbnailDirective,
  ListTitleDirective,
  TitleComponent,
  ToolbarComponent,
  ToolbarSpacerDirective
} from "@fundamental-ngx/core";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RequestInterface} from "../../models/request/request.interface";
import {DialogService} from "@fundamental-ngx/core/dialog";
import {RequestService} from "../../services/request-services/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestRequestInterface} from "../../models/request/requestRequest.interface";
import {ProductService} from "../../services/product-services/product.service";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {WebSocketService} from "../../services/webSocket/web-socket.service";
import {debounceTime} from "rxjs";
import {HoverDetailsComponent} from "../hover-details/hover-details.component";
import {MessageStripAlertService} from "@fundamental-ngx/core/message-strip";


@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    ButtonBarComponent,
    ButtonComponent,
    DialogBodyComponent,
    DialogCloseButtonComponent,
    DialogComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    FormControlComponent,
    FormItemComponent,
    FormLabelComponent,
    FormsModule,
    InputGroupComponent,
    ListBylineDirective,
    ListComponent,
    ListContentDirective,
    ListFooterDirective,
    ListItemComponent,
    ListTitleDirective,
    ReactiveFormsModule,
    TitleComponent,
    ToolbarComponent,
    ToolbarSpacerDirective,
    DialogTemplateDirective,
    NavigationBarComponent,
    AvatarComponent,
    HoverDetailsComponent
  ],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent implements OnInit, OnChanges, OnDestroy{
  private webSocketService: WebSocketService | undefined;
  displayedRequests: RequestInterface[] = [];
  Requests: RequestInterface[] = [];
  searchTerm: string = '';
  productId: number = -1;
  productName: string = '';
  myForm!: FormGroup;
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;

  constructor(private router: Router,
              private requestService: RequestService,
              private productService: ProductService,
              private _fb: FormBuilder,
              private _cdr: ChangeDetectorRef,
              private _dialogService: DialogService,
              private route: ActivatedRoute,
              private messageStripAlertService: MessageStripAlertService) {


  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });
    this.fetchData();
    this.webSocketService = new WebSocketService('/requests');
    this.handleSearchTermChange('');
    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      requestTypeInput: new FormControl(''),
      accountManagerInput: new FormControl('')
    });
    this.webSocketService.updates$.subscribe((listId: number) => {
      debounceTime(500);
      if (listId == this.productId) {
        this.updateData();
      }
    });
  }

  ngOnDestroy(): void {
    this.webSocketService?.updates$.unsubscribe();
  }

  ngOnChanges() {
   this.handleSearchTermChange(this.searchTerm);
  }

  private fetchData() {
    this.requestService.getRequests(this.productId).subscribe(requests => {
      this.Requests = requests;
      this.displayedRequests = requests;
    });
    this.productService.getProductById(this.productId).subscribe(product => {
      this.productName = product.name;
    });
  }

  private updateData() {
    this.requestService.getRequests(this.productId).subscribe(requests => {
      this.Requests = requests;
      this.displayedRequests = requests;
    });
  }

  protected handleSearchTermChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.displayedRequests = this.Requests.filter(request => {
      return request.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  addRequest(dialog: TemplateRef<any>) {
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

    dialogRef.afterClosed.subscribe((result) => {
      this._cdr.detectChanges();
      const requestRequest: RequestRequestInterface = {
        name: this.myForm.value.nameInput,
        description: this.myForm.value.descriptionInput,
        requestType: this.myForm.value.requestTypeInput,
        accountManager: this.myForm.value.accountManagerInput,
      };
      console.log(requestRequest);
      this.requestService.addRequest(requestRequest, this.productId).subscribe((request) => {
        this.fetchData();
        this._cdr.detectChanges();
      }, (error) => {
        this._cdr.detectChanges();
        this.showErrorMessage(error.error.message);
      });
    });
  }

  navigateToIssueList(id: number) {
    this.router.navigate(['/issue-list', id], { state: { productId: this.productId } });
  }

  closeRequest(id: number) {
   this.requestService.closeRequest(id).subscribe(() => {
     this.fetchData();
     this._cdr.detectChanges();
   }, (error) => {
     this._cdr.detectChanges();
     this.showErrorMessage(error.error.message);
   });
  }

  abandonRequest(id: number) {
    this.requestService.abandonRequest(id).subscribe(() => {
      this.fetchData();
      this._cdr.detectChanges();
    }, (error) => {
      this._cdr.detectChanges();
      this.showErrorMessage(error.error.message);
    });
  }

  getTypeIcon(request: RequestInterface): string {
    if (request.requestType === 'PATCH') {
      return 'navigation-up-arrow';
    } else if (request.requestType === 'MINOR') {
      return 'collapse-group\n';
    }
    else if (request.requestType === 'MAJOR') {
      return 'drill-up';
    }
    return 'navigation-up-arrow';
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
}
