import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Service used to request Trello API
export interface Organization {
    id: string;
    name: string;
    displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
    root = 'https://api.trello.com/1';
    constructor(private http: HttpClient) {}

    getOrganization(): Promise<any> {
        const params = new HttpParams().set('token', localStorage.getItem('token'))
            .set('key', environment.api_key)
            .set('organizations', 'all');
        return this.http.get(`${this.root}/members/me`, { params }).toPromise();
    }
}
