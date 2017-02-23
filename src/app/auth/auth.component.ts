import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UsersService } from '../services/users/users.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  currentUser: any;
  message: any = {};

  constructor(
    public authService: AuthService, 
    public usersService: UsersService,
    private modalService: NgbModal
  ) {
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

  showProfileInfo(content) {
    this.usersService.getUser(this.currentUser.auth.uid).subscribe(
      user => this.message.text = '<div> Name: ' + user.displayName + '</div><div> Email: ' + user.email + '</div>');

    this.modalService.open(content);
  }
}
