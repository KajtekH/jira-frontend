import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {
  ButtonBarComponent, ButtonComponent,
  DialogBodyComponent,
  DialogCloseButtonComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent, DialogTemplateDirective,
  FormControlComponent,
  FormItemComponent,
  FormLabelComponent, TitleComponent, ToolbarItemDirective
} from "@fundamental-ngx/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {LoginRequest} from "../../models/auth/login-request";
import {AuthService} from "../../services/auth-services/auth.service";
import {Router} from "@angular/router";
import {TaskRequest} from "../../models/task/taskRequest.interface";
import {DialogService} from "@fundamental-ngx/core/dialog";
import {RegisterRequest} from "../../models/auth/register-request";

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    DialogBodyComponent,
    DialogFooterComponent,
    FormControlComponent,
    FormItemComponent,
    FormLabelComponent,
    ReactiveFormsModule,
    ButtonComponent,
    ToolbarItemDirective,
    ButtonBarComponent,
    CdkDrag,
    DialogCloseButtonComponent,
    DialogComponent,
    DialogHeaderComponent,
    TitleComponent,
    DialogTemplateDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;

  constructor(private authService: AuthService,
              private _fb: FormBuilder,
              private _fb2: FormBuilder,
              private router: Router,
              private _dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      usernameInput: new FormControl(''),
      passwordInput: new FormControl(''),
    });
    this.registerForm = this._fb2.group({
      registerUsernameInput: new FormControl(''),
      registerPasswordInput: new FormControl(''),
      emailInput: new FormControl(''),
      confirmPasswordInput: new FormControl(''),
      firstNameInput: new FormControl(''),
      lastNameInput: new FormControl(''),
    });
    this.authService.stopTokenRefresh();
  }

  onLogin() {
    const loginRequest: LoginRequest = {
      email: this.loginForm.get('usernameInput')?.value,
      password: this.loginForm.get('passwordInput')?.value
    }
    this.authService.login(loginRequest).subscribe(
      (response) => {
        console.log('Login successful:', response);
        const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(response),'secret-key').toString();
        localStorage.setItem('user', encryptedResponse);
        localStorage.setItem('exp', String(response.exp));
        const decryptedData = CryptoJS.AES.decrypt(encryptedResponse,'secret-key');
        const decryptedResponse = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
        console.log('Decrypted response:', decryptedResponse);
        this.router.navigate(['/product-list']);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  openDialog(dialog: TemplateRef<any>): void {
    const dialogRef = this._dialogService.open(dialog, { responsivePadding: false, resizable: false });

    dialogRef.afterClosed.subscribe((result) => {
      const registerRequest: RegisterRequest = {
        email: this.registerForm.get('emailInput')?.value,
        username: this.registerForm.get('registerUsernameInput')?.value,
        password: this.registerForm.get('registerPasswordInput')?.value,
        firstName: this.registerForm.get('firstNameInput')?.value,
        lastName: this.registerForm.get('lastNameInput')?.value
      };
      console.log(registerRequest);
      if (registerRequest.password  !== this.registerForm.get('confirmPasswordInput')?.value) {
        console.log(registerRequest.password);
        console.log(this.registerForm.get('confirmPasswordInput')?.value);
        console.log('Passwords do not match');
        return;
      }
      this.authService.register(registerRequest).subscribe((response) => {
        console.log('Registration successful:', response);
      });
    }, (error) => {
      console.error('Dialog closed with error:', error);
    });
  }
}
