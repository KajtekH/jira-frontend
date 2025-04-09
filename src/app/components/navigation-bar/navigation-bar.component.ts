import {Component, Input, OnInit} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {
  ButtonComponent,
  ShellbarActionComponent,
  ShellbarActionsComponent, ShellbarComponent,
  ShellbarLogoComponent,
  ShellbarSubtitleComponent, ShellbarTitleComponent,
  ShellbarUser,
  ShellbarUserMenu
} from "@fundamental-ngx/core";
import {FundamentalNgxCxModule} from "@fundamental-ngx/cx";
import {SearchFieldComponent} from "@fundamental-ngx/platform";
import {AuthService} from "../../services/auth-services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    ShellbarTitleComponent,
    ShellbarActionsComponent,
    ShellbarComponent,
    FundamentalNgxCxModule,
    ButtonComponent,
    SearchFieldComponent
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent implements  OnInit {
  condensed = true;
  @Input() title = '';
  @Input() productVisible = false;
  @Input() productId = -1;
  @Input() requestId = -1;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  user: ShellbarUser = {
    fullName: '',
    colorAccent: 1
  };

  userMenu: ShellbarUserMenu[] = [{ text: 'Settings'}, { text: 'Sign Out', callback: () => this.onLogout()}];

  ngOnInit(): void {
   const encryptedData = localStorage.getItem('user');
    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, 'secret-key');
      const decryptedResponse = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
      this.user.fullName = decryptedResponse.firstName + ' ' + decryptedResponse.lastName;
    }
    console.log("productId", this.productId);
    console.log("requestId", this.requestId);
  }

  onLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('exp');
    this.authService.logout().subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.router.navigate(['/login']);
        console.error('Logout error:', error);
      }
    });
  }

  navigateToProducts() {
    this.router.navigate(['/product-list']);
  }
  navigateToRequests() {
    this.router.navigate(['/request-list/' + this.productId]);
  }

  navigateToIssues() {
    this.router.navigate(['/issue-list/' + this.requestId], { state: { productId: this.productId } });
  }
}
