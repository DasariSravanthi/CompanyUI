import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private router: Router) {}

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}
