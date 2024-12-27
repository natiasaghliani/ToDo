import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  nickname: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  signIn() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((user: any) =>
      user.nickname === this.nickname && user.password === this.password
    );

    if (user) {
      this.authService.logIn(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/profile']);
    } else {
      alert('Invalid credentials');
    }
  }

}
