import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserManagementPage } from './user-management.page';
import { UsersService, InviteUserDto, UpdateUserDto } from '@univeex/users/data-access';
import { RolesService } from '@univeex/roles/data-access';
import { Role, UserStatus } from '@univeex/shared/util-types';
import { NotificationService } from '@univeex/notifications/data-access';
import { WebSocketService } from '@univeex/websockets/data-access';
import { AuthService } from '@univeex/auth/data-access';
import { TranslateModule } from '@ngx-translate/core';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { LucideAngularModule, UserPlus, Save, X, Send, User, History, Trash2, Key, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, FilePenLine, Ban, UserCog, Mail, ChevronLeft, ChevronRight, Plus, RefreshCw, Power, PowerOff, Building, Lock, Archive, UserCheck, Zap, FileInput, FileOutput, UserCircle2, LogOut } from 'lucide-angular';
import { User as ApiUser } from '@univeex/shared/util-types';

const mockUsers: ApiUser[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@doe.com', status: UserStatus.ACTIVE, roles: [{id: '1', name: 'Admin', description: 'Admin role', permissions: [], isSystemRole: true}], organization: {id: '1'}, isOnline: true, permissions: [], token: 'abc' },
  { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane@doe.com', status: UserStatus.PENDING, roles: [{id: '2', name: 'User', description: 'User role', permissions: [], isSystemRole: false}], organization: {id: '1'}, isOnline: false, permissions: [], token: 'abc' },
];

const mockRoles: Role[] = [
    { id: '1', name: 'Admin', permissions: [], description: 'Admin', isSystemRole: true },
    { id: '2', name: 'User', permissions: [], description: 'User', isSystemRole: false },
]

describe('UserManagementPage', () => {
  let component: UserManagementPage;
  let fixture: ComponentFixture<UserManagementPage>;
  let usersService: UsersService;
  let notificationService: NotificationService;

  const mockUsersService = {
    getUsers: jest.fn(() => of({ data: mockUsers, total: mockUsers.length })),
    inviteUser: jest.fn(() => of(mockUsers[0])),
    updateUser: jest.fn(() => of(mockUsers[0])),
    deleteUser: jest.fn(() => of(undefined)),
  };

  const mockRolesService = {
    getRoles: jest.fn(() => of(mockRoles)),
  };

  const mockNotificationService = {
    showError: jest.fn(),
    showSuccess: jest.fn(),
  };

  const mockWebSocketService = {
    listen: () => of({}),
    disconnect: jest.fn(),
  };

  const mockAuthService = {
    currentUser: () => null,
    impersonate: () => of(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserManagementPage,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HasPermissionDirective,
        LucideAngularModule.pick({ UserPlus, Save, X, Send, User, History, Trash2, Key, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, FilePenLine, Ban, UserCog, Mail, ChevronLeft, ChevronRight, Plus, RefreshCw, Power, PowerOff, Building, Lock, Archive, UserCheck, Zap, FileInput, FileOutput, UserCircle2, LogOut })
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: UsersService, useValue: mockUsersService },
        { provide: RolesService, useValue: mockRolesService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: WebSocketService, useValue: mockWebSocketService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementPage);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(mockUsersService.getUsers).toHaveBeenCalled();
    expect(component.users().length).toBe(2);
    expect(component.totalUsers()).toBe(2);
  });

  it('should open invite modal', () => {
    component.openInviteModal();
    expect(component.isEditMode()).toBe(false);
    expect(component.userModalOpen()).toBe(true);
    expect(component.userForm.value.id).toBeNull();
  });

  it('should open edit modal and patch form values', () => {
    const userToEdit = mockUsers[0];
    component.openEditModal(userToEdit);
    expect(component.isEditMode()).toBe(true);
    expect(component.userModalOpen()).toBe(true);
    expect(component.selectedUser).toBe(userToEdit);
    expect(component.userForm.value.firstName).toBe(userToEdit.firstName);
  });

  it('should invite a new user', fakeAsync(() => {
    component.openInviteModal();
    component.userForm.patchValue({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        roleId: '1',
    });
    component.save();
    tick();

    const payload: InviteUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        roleId: '1',
    };
    expect(mockUsersService.inviteUser).toHaveBeenCalledWith(payload);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Usuario invitado con éxito.');
    expect(mockUsersService.getUsers).toHaveBeenCalledTimes(2); // 1 on init, 1 after save
  }));

  it('should update an existing user', fakeAsync(() => {
    const userToEdit = mockUsers[0];
    component.openEditModal(userToEdit);
    component.userForm.patchValue({
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@doe.com',
        roleId: '2',
    });
    component.save();
    tick();

    const payload: UpdateUserDto = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@doe.com',
        roleId: '2',
    };
    expect(mockUsersService.updateUser).toHaveBeenCalledWith(userToEdit.id, payload);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Usuario actualizado con éxito.');
    expect(mockUsersService.getUsers).toHaveBeenCalledTimes(2);
  }));

  it('should delete a user', fakeAsync(() => {
    const userToDelete = mockUsers[0];
    component.openDeleteModal(userToDelete);
    expect(component.deleteModalOpen()).toBe(true);
    expect(component.selectedUser).toBe(userToDelete);

    component.confirmDelete();
    tick();

    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userToDelete.id);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Usuario eliminado con éxito.');
    expect(mockUsersService.getUsers).toHaveBeenCalledTimes(2);
  }));
});
