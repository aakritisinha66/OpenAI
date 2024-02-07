import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
    providedIn: 'root',
})
export class OpenaiService {
    private baseUrl = 'http://localhost:8001'; // Replace with your backend URL
    accessToken= '';
    isAuthenticated= false;

    constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) { }

    sendUserInput(userInput: string): Observable<any> {
        this.oidcSecurityService.checkAuth().subscribe((authResult: any) => {
            this.accessToken = authResult.accessToken;
            console.log("Access Token: ", this.accessToken)
            this.isAuthenticated = authResult.isAuthenticated;
        })
        if (this.isAuthenticated) {
            console.log("Authenticated? ",this.isAuthenticated)
            const body = { userInput };
            // Include the access token in the Authorization header
            const headers = {
                Authorization: `Bearer ${this.accessToken}`
            };
            console.log("Input: ", body)
            return this.http.post<any>(`${this.baseUrl}/conversation`, body, { headers });
        }
        else {
            // Handle the case when the user is not authenticated
            // You might want to redirect the user to the login page
            // or display an error message.
            return new Observable<"">;
        }
    }
}
