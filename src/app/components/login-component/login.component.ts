import {Component, OnInit} from '@angular/core';
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
    ToolbarItemDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private authService: AuthService,
              private _fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.myForm = this._fb.group({
      usernameInput: new FormControl(''),
      passwordInput: new FormControl(''),
    });
    this.authService.stopTokenRefresh();
  }

  onLogin() {
    const loginRequest: LoginRequest = {
      email: this.myForm.get('usernameInput')?.value,
      password: this.myForm.get('passwordInput')?.value
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
}
