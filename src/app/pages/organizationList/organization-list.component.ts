import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';
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
    idPowerUp: string;
    isIdPowerUpSet: boolean;
    @Output() selectedOrgOut = new EventEmitter<Organization>();
    // @Output() selectedOrgSend = new EventEmitter<Organization>();
    orgControl = new FormControl('', Validators.required);
    powerUpControl = new FormControl('', Validators.pattern('^[0-9a-fA-F]{24}$'));

    constructor(private trelloService: TrelloService) {
        this.isIdPowerUpSet = false;
    }

    ngOnInit() {
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

    saveId() {
        localStorage.setItem('idPowerUp', this.idPowerUp);
        this.isIdPowerUpSet = true;
    }

    deleteId() {
        localStorage.removeItem('idPowerUp');
        this.isIdPowerUpSet = false;
        this.idPowerUp = '';
    }
}
