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
  PopoverModule,
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
  InputGroupComponent,
  ListBylineDirective, ListBylineLeftDirective,
  ListComponent,
  ListContentDirective,
  ListFooterDirective,
  ListItemComponent,
  ListTitleDirective, ScrollbarDirective,
  TitleComponent, ToolbarComponent, ToolbarSpacerDirective, ComboboxComponent
} from "@fundamental-ngx/core";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProductInterface} from "../../models/product/product.interface";
import {Router} from "@angular/router";
import {DialogService} from "@fundamental-ngx/core/dialog";
import {ProductService} from "../../services/product-services/product.service";
import {ProductRequestInterface} from "../../models/product/product-request.interface";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {WebSocketService} from "../../services/webSocket/web-socket.service";
import {debounceTime} from "rxjs";
import {DatePipe} from "@angular/common";
import {HoverDetailsComponent} from "../hover-details/hover-details.component";
import {MessageStripAlertService} from "@fundamental-ngx/core/message-strip";
import {UserService} from "../../services/user-services/user.service";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ButtonBarComponent,
    ButtonComponent,
    DialogBodyComponent,
    DialogCloseButtonComponent,
    DialogComponent,
    DialogFooterComponent,
    PopoverModule,
    DialogHeaderComponent,
    FormControlComponent,
    FormItemComponent,
    FormLabelComponent,
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
    FormsModule,
    ListBylineLeftDirective,
    DialogTemplateDirective,
    NavigationBarComponent,
    ScrollbarDirective,
    DatePipe,
    AvatarComponent,
    HoverDetailsComponent,
    ComboboxComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnChanges, OnDestroy{
  private webSocketService: WebSocketService | undefined;
  displayedProducts: ProductInterface[] = [];
  products: ProductInterface[] = [];
  searchTerm: string = '';
  myForm!: FormGroup;
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;
  owners: String[] = [];

  constructor(private router: Router,
              private productService: ProductService,
              private userService: UserService,
              private _fb: FormBuilder,
              private _cdr: ChangeDetectorRef,
              private messageStripAlertService: MessageStripAlertService,
              private _dialogService: DialogService) { }

  ngOnInit(): void {
    this.webSocketService = new WebSocketService('/products');
    this.fetchData();
    this.handleSearchTermChange('');
    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      ownerInput: new FormControl('')
    });

    this.webSocketService.updates$.subscribe(() => {
      debounceTime(500);
      this.fetchData();
    });

    this.userService.getUsersByRole("OWNER").subscribe((users: String[]) => {
      this.owners = users;
      this._cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.webSocketService?.updates$.unsubscribe();
  }

  ngOnChanges(): void {
  }

  private fetchData() {
    this.productService.getProducts().subscribe((products: ProductInterface[]) => {
      this.products = products;
      this.displayedProducts = products;
    });
  }

  protected handleSearchTermChange(s: string) {
    this.searchTerm = s;
    this.displayedProducts = this.products.filter((product) => {
      return product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  addProduct(dialog: TemplateRef<any>) {
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
      const productRequest: ProductRequestInterface = {
        name: this.myForm.value.nameInput,
        description: this.myForm.value.descriptionInput,
        owner: this.myForm.value.ownerInput,
      };
      console.log(productRequest);
      this.productService.addProduct(productRequest).subscribe((product) => {
        this.fetchData();
        this._cdr.detectChanges();
      }, (error) => {
        this._cdr.detectChanges();
        this.showErrorMessage(error.error.message);
      });
    })
  }

  navigateToRequestList(id: number) {
    this.router.navigate(['request-list', id]);
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
