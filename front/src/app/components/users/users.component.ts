import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { User } from '../../models/user';
import { Login } from '../../models/login';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';
import { SecurityService } from '../../services/guards/security.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface RoleOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'login', 'role', 'actions'];

  loading = false;
  showCreateForm = false;
  isCreating = false;
  errorMessage = '';
  successMessage = '';

  createForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  assignableRoles: RoleOption[] = [];
  currentUserRole: string | null = null;

  private readonly roleLabels: Record<string, string> = {
    SUPER_ADMIN: 'Super Administrateur',
    ADMIN: 'Administrateur',
    POINTEUR: 'Pointeur',
  };

  constructor(
    private service: ResourceService<Login>,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.securityService.getUserRole();
    this.loadUsers();
    this.loadAssignableRoles();
    this.initCreateForm();
  }

  private initCreateForm(): void {
    this.createForm = this.fb.group(
      {
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        login: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private loadAssignableRoles(): void {
    this.http.get<string[]>('/api/users/roles').subscribe({
      next: (roles) => {
        this.assignableRoles = roles.map((r) => ({
          value: r,
          label: this.getRoleLabel(r),
        }));
        // Pre-select first role if only one available
        if (this.assignableRoles.length === 1) {
          this.createForm.get('role')?.setValue(this.assignableRoles[0].value);
        }
      },
      error: () => {
        this.snackBar.openBar('Erreur lors du chargement des rôles', 'error');
      },
    });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (password !== confirm) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUsers(): void {
    this.loading = true;
    this.service.getAll('users').subscribe({
      next: (users: User[]) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.openBar('Erreur lors du chargement des utilisateurs', 'error');
      },
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showCreateForm) {
      this.createForm.reset();
    }
  }

  onCreateUser(): void {
    if (this.createForm.invalid) return;

    this.isCreating = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { confirmPassword, ...payload } = this.createForm.getRawValue();

    this.service.create(payload as Login, 'users').subscribe({
      next: () => {
        this.snackBar.success('Utilisateur créé avec succès');
        this.isCreating = false;
        this.createForm.reset();
        this.showCreateForm = false;
        this.loadUsers();
      },
      error: (err) => {
        this.snackBar.error(err.error?.message || "Erreur lors de la création de l'utilisateur");
        this.isCreating = false;
      },
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer l'utilisateur <b>${user.firstName} ${user.lastName}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.delete(user.id, 'users').subscribe({
          next: () => {
            this.snackBar.openBar('Utilisateur supprimé avec succès', 'success');
            this.loadUsers();
          },
          error: (err) => {
            this.snackBar.openBar(err.error?.message || "Erreur lors de la suppression", 'error');
          },
        });
      }
    });
  }

  canDeleteUser(user: User): boolean {
    return this.assignableRoles.some((r) => r.value === user.role);
  }

  getRoleLabel(role: string): string {
    return this.roleLabels[role] || role;
  }
}

