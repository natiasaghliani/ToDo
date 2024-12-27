import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user: any = null;
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
  
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
