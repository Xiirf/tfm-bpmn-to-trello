import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {
    root = 'http://localhost:8000/api/v1';
    constructor(private http: HttpClient) {}

    generateTrello(teamName: string, file: string): Promise<any> {
        return this.http.post(`${this.root}/generate`, {
            token: localStorage.getItem('token'),
            key: localStorage.getItem('key'),
            teamName,
            file
        }).toPromise();
    }
}
