import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';
import { TrelloService, Organization } from 'src/app/services/trello.service';
import { FormControl, Validators } from '@angular/forms';

// Component to display and select Trello organization

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})

export class OrganizationListComponent implements OnInit {

    organizationList: Organization[] = [];
    selectedOrg: Organization;
    @Output() selectedOrgOut = new EventEmitter<Organization>();
    orgControl = new FormControl('', Validators.required);

    constructor(private trelloService: TrelloService) {
    }

    ngOnInit() {
        // Get trello organization from token owner
        this.trelloService.getOrganization()
            .then((data) => {
                for (const org of data.organizations) {
                    this.organizationList.push({id: org.id, name: org.name, displayName: org.displayName});
                }
                console.log(JSON.stringify(this.organizationList));
            })
            .catch((error) => console.log(error));
    }

    sendData(data) {
        this.selectedOrg = data;
        this.selectedOrgOut.emit(this.selectedOrg);
    }
}
