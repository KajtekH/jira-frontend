import {ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
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
  ListBylineLeftDirective,
  ListBylineRightDirective,
  ListComponent,
  ListContentDirective,
  ListFooterDirective,
  ListItemComponent,
  ListThumbnailDirective,
  ListTitleDirective,
  TitleComponent,
  ToolbarComponent,
  ToolbarLabelDirective,
  ToolbarSpacerDirective
} from "@fundamental-ngx/core";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RequestInterface} from "../../models/request/request.interface";
import {DialogService} from "@fundamental-ngx/core/dialog";
import {RequestService} from "../../services/request-services/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IssueRequestInterface} from "../../models/issue/issueRequest.interface";
import {RequestRequestInterface} from "../../models/request/requestRequest.interface";
import {ProductService} from "../../services/product-services/product.service";

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
    IconComponent,
    InputGroupComponent,
    ListBylineDirective,
    ListComponent,
    ListContentDirective,
    ListFooterDirective,
    ListItemComponent,
    ListThumbnailDirective,
    ListTitleDirective,
    ReactiveFormsModule,
    TitleComponent,
    ToolbarComponent,
    ToolbarLabelDirective,
    ToolbarSpacerDirective,
    DialogTemplateDirective
  ],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent implements OnInit, OnChanges{
  displayedRequests: RequestInterface[] = [];
  Requests: RequestInterface[] = [];
  searchTerm: string = '';
  productId: number = 0;
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
              private route: ActivatedRoute) {


  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });
    this.fetchData();
    this.handleSearchTermChange('');
    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      requestTypeInput: new FormControl(''),
      accountManagerInput: new FormControl('')
    });
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

  protected handleSearchTermChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.displayedRequests = this.Requests.filter(request => {
      return request.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  addRequest(dialog: TemplateRef<any>) {
    const dialogRef = this._dialogService.open(dialog, {responsivePadding: false, resizable: true});

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
      });
    }, (error) => {
      this._cdr.detectChanges();
    });
  }

  navigateToIssueList(id: number) {
    this.router.navigate(['/issue-list', id]);
  }

  closeRequest(id: number) {
   this.requestService.closeRequest(id).subscribe(() => {
     this.fetchData();
     this._cdr.detectChanges();
   });
  }

  abandonRequest(id: number) {
    this.requestService.abandonRequest(id).subscribe(() => {
      this.fetchData();
      this._cdr.detectChanges();
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
}
