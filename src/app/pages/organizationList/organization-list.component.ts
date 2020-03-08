import { Component, OnInit } from '@angular/core';
import { TrelloService, Organization } from 'src/app/services/trello.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})

export class OrganizationListComponent implements OnInit {

    organizationList: Organization[] = [];
    selectedOrg: Organization;
    orgControl = new FormControl('', Validators.required);

    constructor(private trelloService: TrelloService) {}

    ngOnInit() {
        this.trelloService.getOrganization()
            .then((data) => {
                for (const org of data.organizations) {
                    this.organizationList.push({id: org.id, name: org.displayName});
                }
                this.selectedOrg = this.organizationList[0];
                console.log(JSON.stringify(this.organizationList));
            })
            .catch((error) => console.log(error));
    }

}
