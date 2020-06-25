import { Component, OnInit } from '@angular/core';
declare let window: any;

// This component is a window used to get token then automatically close herself
@Component({
  selector: 'app-save-token',
  templateUrl: './save-token.component.html',
  styleUrls: ['./save-token.component.scss']
})
export class SaveTokenComponent implements OnInit {

    ngOnInit(): void {
        const token = window.location.hash.substring(7);
        if (token) {
            localStorage.setItem('token', token);
        }
        setTimeout( () => { window.close(); }, 1000);
    }
}
