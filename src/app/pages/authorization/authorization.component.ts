import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare let TrelloPowerUp: any;
declare let window: any;

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

    Promise = TrelloPowerUp.Promise;
    token: string;

    ngOnInit() {
        if (!localStorage.getItem('key')) {
            localStorage.setItem('key', environment.api_key);
        } else if (localStorage.getItem('key') === environment.api_key) {
            if (localStorage.getItem('token')) {
                this.token = localStorage.getItem('token');
            }
        }
    }

    authorize() {
        const t = window.TrelloPowerUp.iframe({
            appKey: environment.api_key,
            appName: 'Next_Task'
        });
        t.getRestApi()
        .authorize({ scope: 'read,write', returnUrl: `${window.location.origin}/saveToken`})
        .catch(TrelloPowerUp.restApiError.AuthDeniedError, () => {
            if (localStorage.getItem('token')) {
                this.token = localStorage.getItem('token');
                alert('Success!');
            } else {
                alert('Cancelled!');
            }
        });
    }

    deleteToken() {
        localStorage.removeItem('token');
        this.token = null;
    }
}
