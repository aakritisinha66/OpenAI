import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
            authority: 'https://dev-1c4yunaca03oxj5s.us.auth0.com',
            redirectUrl: window.location.origin,
            clientId: 'jsZrMuQZIqoCn52I7US7iCPmQ4yd2GWd',
            scope: 'openid profile offline_access',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
        }
    })],
    exports: [AuthModule],
})
export class AuthConfigModule { }
