import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AvatarComponent,
  ComboboxComponent,
  InputGroupComponent,
  ListBylineDirective,
  ListBylineLeftDirective, ListBylineRightDirective,
  ListComponent,
  ListContentDirective,
  ListFooterDirective,
  ListItemComponent,
  ListTitleDirective,
  ScrollbarDirective,
  TitleComponent, ToolbarComponent, ToolbarSpacerDirective
} from "@fundamental-ngx/core";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavigationBarComponent} from "../navigation-bar/navigation-bar.component";
import {WebSocketService} from "../../services/webSocket/web-socket.service";
import {Router} from "@angular/router";
import {DialogService} from "@fundamental-ngx/core/dialog";
import {debounceTime} from "rxjs";
import {UserInterface} from "../../models/user/user.interface";
import {UserService} from "../../services/user-services/user.service";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    AvatarComponent,
    FormsModule,
    InputGroupComponent,
    ListBylineDirective,
    ListBylineLeftDirective,
    ListComponent,
    ListContentDirective,
    ListFooterDirective,
    ListItemComponent,
    ListTitleDirective,
    NavigationBarComponent,
    ReactiveFormsModule,
    ScrollbarDirective,
    ToolbarComponent,
    ToolbarSpacerDirective,
    ComboboxComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy, OnChanges {
  private webSocketService: WebSocketService | undefined;
  displayedUsers: UserInterface[] = [];
  users: UserInterface[] = [];
  searchTerm: string = '';
  roles: string[] = ['USER', 'WORKER', 'PRODUCT_MANAGER', 'ACCOUNT_MANAGER', 'OWNER', 'ADMIN'];
  @ViewChild('overlay')
  overlay: ElementRef<HTMLElement> | undefined;
  activeStatuses: string[] = ['true', 'false'];
  constructor(private router: Router,
              private userService: UserService,
              private _cdr: ChangeDetectorRef,
              private _dialogService: DialogService) { }

  ngOnInit(): void {
    this.webSocketService = new WebSocketService('/users');
    this.fetchData();
    this.handleSearchTermChange('');

    this.webSocketService.updates$.subscribe((listId: number) => {
      debounceTime(500);
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    this.webSocketService?.updates$.unsubscribe();
  }

  ngOnChanges(): void {
  }

  private fetchData() {
    this.userService.getAllUsers().subscribe((users: UserInterface[]) => {
      this.users = users;
      this.displayedUsers = users;
    });
  }

  protected handleSearchTermChange(s: string) {
    this.searchTerm = s;
    this.displayedUsers = this.users.filter((user) => {
      return user.username.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  onRoleChange(user: UserInterface, selectedRole: string): void {
    console.log('Wybrana rola dla użytkownika', user.username, ':', selectedRole);
    this.userService.updateUserRole(user.id, selectedRole).subscribe({
      next: (response) => {
        console.log('Rola użytkownika zaktualizowana:', response);
        this.fetchData(); // Refresh the user list after role update
      },
      error: (error) => {
        console.error('Błąd podczas aktualizacji roli użytkownika:', error);
      }
    });
  }

  onActiveStatusChange(user: UserInterface, isActive: boolean): void {
    console.log('Wybrany status aktywności dla użytkownika', user.username, ':', isActive);
    this.userService.changeUserStatus(user.id, isActive).subscribe({
      next: (response) => {
        console.log('Status aktywności użytkownika zaktualizowany:', response);
        this.fetchData(); // Refresh the user list after status update
      },
      error: (error) => {
        console.error('Błąd podczas aktualizacji statusu aktywności użytkownika:', error);
      }
    });
  }
}
