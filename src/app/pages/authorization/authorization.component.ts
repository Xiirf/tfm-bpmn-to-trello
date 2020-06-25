import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Organization } from 'src/app/services/trello.service';
declare let TrelloPowerUp: any;
declare let window: any;

// This component is used to get the token from Trello
@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

    Promise = TrelloPowerUp.Promise;
    token: string;
    selectedOrg: Organization;
    @Output() selectedOrgOut = new EventEmitter<Organization>();

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

    // Event to get the selected org
    setSelectedOrg(data) {
        this.selectedOrg = data;
        this.selectedOrgOut.emit(this.selectedOrg);
    }

    deleteToken() {
        localStorage.removeItem('token');
        this.token = null;
    }
}
