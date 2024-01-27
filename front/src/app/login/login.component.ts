import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
  data: any;

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
  }

  onSubmit() {
    this.service.login(this.loginForm.getRawValue(), 'login').subscribe(
      (response) => {
        this.securityService.setAuthToken(response.token);
        this.router.navigate(['accueil']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
