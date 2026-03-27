import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../services/guards/security.service';
import { ResourceService } from '../services/resource.service';
import { Login } from '../models/login';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';

  constructor(
    public securityService: SecurityService,
    public service: ResourceService<Login>,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    if (this.securityService.isLoggedIn()) {
      this.router.navigate(['accueil']);
      return;
    }

    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
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
        this.snackBar.error(err.error?.message || 'Identifiants incorrects. Veuillez réessayer.');
        this.isLoading = false;
      },
    });
  }
}
