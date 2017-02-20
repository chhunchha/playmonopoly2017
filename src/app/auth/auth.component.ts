import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  currentUser: any;

  constructor(public authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getUserPicture() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.isAuthenticated() && this.currentUser.auth) {
      return this.currentUser.auth.photoURL;
    }
  }
}
