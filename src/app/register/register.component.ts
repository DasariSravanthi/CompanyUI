import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('data');
    }
  }

  get formControl() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.httpClient.post('http://localhost:5110/User/SignUp', this.registerForm.value).subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('login');
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}