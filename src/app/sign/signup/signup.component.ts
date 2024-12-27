import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  name: string = '';
  nickname: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  signUp() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    const userId = Date.now().toString();
    const newUser = {
      id: userId,
      name: this.name,
      nickname: this.nickname,
      password: this.password,
    };
  
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
  
    alert('Sign up successful!');
    this.router.navigate(['/login']);
  }

}
