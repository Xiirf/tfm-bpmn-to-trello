import { Component } from '@angular/core';
import { Organization } from 'src/app/services/trello.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent {
  selectedOrg: Organization;

  setSelectedOrg(data) {
    this.selectedOrg = data;
  }
}
