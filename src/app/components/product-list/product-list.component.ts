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
  ListBylineDirective, ListBylineLeftDirective,
  ListComponent,
  ListContentDirective,
  ListFooterDirective,
  ListItemComponent,
  ListThumbnailDirective,
  ListTitleDirective,
  TitleComponent, ToolbarComponent, ToolbarLabelDirective, ToolbarSpacerDirective
} from "@fundamental-ngx/core";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProductInterface} from "../../models/product/product.interface";
import {Router} from "@angular/router";
import {RequestService} from "../../services/request-services/request.service";
import {DialogService} from "@fundamental-ngx/core/dialog";
import {ProductService} from "../../services/product-services/product.service";
import {RequestRequestInterface} from "../../models/request/requestRequest.interface";
import {ProductRequestInterface} from "../../models/product/product-request.interface";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";

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
    DialogHeaderComponent,
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
    ReactiveFormsModule,
    TitleComponent,
    ToolbarComponent,
    ToolbarLabelDirective,
    ToolbarSpacerDirective,
    FormsModule,
    ListBylineLeftDirective,
    DialogTemplateDirective,
    NavigationBarComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnChanges{
  displayedProducts: ProductInterface[] = [];
  products: ProductInterface[] = [];
  searchTerm: string = '';
  myForm!: FormGroup;
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;
  constructor(private router: Router,
              private productService: ProductService,
              private _fb: FormBuilder,
              private _cdr: ChangeDetectorRef,
              private _dialogService: DialogService) { }

  ngOnInit(): void {
    this.fetchData();
    this.handleSearchTermChange('');
    this.myForm = this._fb.group({
      nameInput: new FormControl(''),
      descriptionInput: new FormControl(''),
      ownerInput: new FormControl('')
    });
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
    const dialogRef = this._dialogService.open(dialog, {responsivePadding: false, resizable: true});

    dialogRef.afterClosed.subscribe((result) => {
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
      });
    }, (error) => {
      this._cdr.detectChanges();
    });
  }

  navigateToRequestList(id: number) {
    this.router.navigate(['request-list', id]);
  }
}
