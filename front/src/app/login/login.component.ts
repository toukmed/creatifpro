import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../services/guards/security.service';
import { ResourceService } from '../services/resource.service';
import { Login } from '../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    public securityService: SecurityService,
    public service: ResourceService<Login>,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
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

  switchMode(loginMode: boolean): void {
    this.isLoginMode = loginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.service.login(this.loginForm.getRawValue(), 'login').subscribe({
      next: (response) => {
        this.securityService.setAuthToken(response.token);
        this.router.navigate(['accueil']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        this.isLoading = false;
      },
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { confirmPassword, ...payload } = this.registerForm.getRawValue();

    this.service.register(payload as Login, 'register').subscribe({
      next: () => {
        this.successMessage = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        this.isLoading = false;
        setTimeout(() => this.switchMode(true), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de la création du compte.";
        this.isLoading = false;
      },
    });
  }
}
