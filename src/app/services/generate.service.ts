import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {
    root = 'http://localhost:8000/api/v1';
    constructor(private http: HttpClient) {}

    generateTrello(teamName: string, file: string): Promise<any> {
        const params = new HttpParams().set('token', localStorage.getItem('token'))
            .set('key', environment.api_key)
            .set('teamName', teamName)
            .set('file', file);
        return this.http.get(`${this.root}/generate`, { params }).toPromise();
    }
}
