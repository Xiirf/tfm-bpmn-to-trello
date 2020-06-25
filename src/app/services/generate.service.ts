import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Service used to send diagram to bpmn-to-trello-api
@Injectable({
  providedIn: 'root'
})
export class GenerateService {
    constructor(private http: HttpClient) {}

    generateTrello(teamName: string, file: string): Promise<any> {
        return this.http.post(`${environment.urlAPI}/generate`, {
            token: localStorage.getItem('token'),
            key: localStorage.getItem('key'),
            teamName,
            idPowerUp: environment.idPowerUp,
            file
        }).toPromise();
    }
}
