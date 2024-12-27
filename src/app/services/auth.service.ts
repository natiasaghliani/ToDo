import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject = new BehaviorSubject<any>(currentUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!currentUser.id);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
    // const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    // if (currentUser) {
    //   this.currentUserSubject.next(currentUser);
    //   this.isLoggedInSubject.next(true);
    // }
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  logIn(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

 

  logOut() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  updateUserData(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
