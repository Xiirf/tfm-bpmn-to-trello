import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Organization {
    id: string;
    name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
    root = 'https://api.trello.com/1';
    constructor(private http: HttpClient) { }

    getAllListBoard(idBoard: string, token: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.api_key);
        return this.http.get(`${this.root}/boards/${idBoard}/lists`, { params }).toPromise();
    }

    moveCard(idCard: string, idList: string, token: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.api_key)
                                        .set('idList', idList);
        return this.http.put(`${this.root}/cards/${idCard}`, null, { params }).toPromise();
    }

    getOrganization(): Promise<any> {
        const params = new HttpParams().set('token', localStorage.getItem('token'))
            .set('key', environment.api_key)
            .set('organizations', 'all');
        return this.http.get(`${this.root}/members/me`, { params }).toPromise();
    }
}
