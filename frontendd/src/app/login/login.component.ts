import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isAuthenticated = false;
  userData: any = '';
  constructor(public oidcSecurityService: OidcSecurityService, private router: Router) {
  }

  ngOnInit() {
    console.log("Login component!")
    // this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData}) => {});
    // console.log('OIDC Configuration:', this.oidcSecurityService.getConfig());
    this.oidcSecurityService.checkAuth().subscribe((authResult: any) => {
      const isAuthenticated = authResult.isAuthenticated;
      this.isAuthenticated = isAuthenticated;
      const userData = authResult.userData;
      this.userData = userData
      console.log('user data:', authResult);
      if (this.isAuthenticated) {
        console.log("Go to home!")
        // User is authenticated, navigate to the home component
        this.goToHome()
      }
    },
      (error) => {
        console.error('Error during authentication check:', error);
        // Add this line to see the full error stack trace
        console.error('Error stack trace:', error.stack);
      });
  }

  goToHome(){
    this.router.navigateByUrl('/home');
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe((result: any) => console.log(result));
  }
}
