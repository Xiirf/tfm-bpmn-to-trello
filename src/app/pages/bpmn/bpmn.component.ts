import {
    Component,
    ElementRef,
    OnInit,
    OnDestroy,
    ViewChild,
    Input
  } from '@angular/core';

import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from '@progress/kendo-file-saver';
import { Organization } from 'src/app/services/trello.service';
import { GenerateService } from 'src/app/services/generate.service';
import { ToastrService } from 'ngx-toastr';

// This component is used to interact with the BPMN diagram

@Component({
  selector: 'app-bpmn',
  templateUrl: './bpmn.component.html',
  styleUrls: ['./bpmn.component.scss']
})

export class BpmnComponent implements OnInit, OnDestroy {
    // instantiate BpmnJS with component
    bpmnJS: BpmnJS;
    @ViewChild('canvas', {static: true}) private canvasRef: ElementRef;
    @ViewChild('propertiesPanel', {static: true}) private propertiesPanelRef: ElementRef;
    bpmnModeler: BpmnModeler;

    @Input() selectedOrg: Organization;

    // retrieve DOM element reference
    @ViewChild('ref', {static: true}) private el: ElementRef;

    constructor(private http: HttpClient,
                private sanitizer: DomSanitizer,
                private generateService: GenerateService,
                private toastr: ToastrService) { }

    ngOnInit(): void {
        this.bpmnModeler = new BpmnModeler({
            container: '#canvas',
            propertiesPanel: {
                parent: '#properties'
            },
            additionalModules: [
              propertiesPanelModule,
              propertiesProviderModule
            ],
            moddleExtensions: {
              camunda: camundaModdleDescriptor
            }
        });
        this.loadXML();
    }

    // Drop file on the diagram div
    drop(event) {
        if (event.dataTransfer.files[0]) {
            const reader = new FileReader();
            // Display the diagram
            reader.onload = (e) => {
                const text = reader.result.toString();
                this.displayDiagram(text);
            };
            reader.readAsText(event.dataTransfer.files[0]);
        }
        event.preventDefault();
        event.stopPropagation();
    }

    // Allow drop on the diagram div
    allowDrop(event) {
        event.preventDefault();
    }

    // Loard a first diagram
    loadXML() {
        this.http.get('/assets/diagram_V1.bpmn',
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'text/xml')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('Access-Control-Allow-Origin', '*')
            // tslint:disable-next-line:max-line-length
            .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
            responseType: 'text'
        })
        .subscribe((xmlContent) => {
            this.displayDiagram(xmlContent);
        });
    }

    displayDiagram(xml) {
        this.bpmnModeler.importXML(xml, (err, warnings) => {
            if (err) {
                this.toastr.error(err);
            }
            this.toastr.success('Diagram displayed');
        });
    }

    // Call the service to send the diagram to our api
    genTrello() {
        this.bpmnModeler.saveXML((err: any, xml: any) => {
            if (!err) {
                this.generateService.generateTrello(this.selectedOrg.id, xml)
                .then((resp) => { this.toastr.success(resp.message); })
                .catch((error) => {
                    if (error.error.msg) {
                        this.toastr.error(error.error.msg);
                    } else {
                        console.log(error.error);
                        this.toastr.error(error.error.error);
                    }
                });
            }
        });
    }

    // Get the current diagram as svg file
    saveSVG() {
        this.bpmnModeler.saveSVG((err: any, svg: any) => {
            if (!err) {
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                saveAs(blob, 'diagram.svg');
            }
        });
    }

    // Get the current diagram as xml file
    saveDiagram() {
        this.bpmnModeler.saveXML((err: any, xml: any) => {
            if (!err) {
                const blob = new Blob([xml], { type: 'image/svg+xml' });
                saveAs(blob, 'diagram.bpmn');
            }
        });
    }

    ngOnDestroy(): void {
        this.bpmnModeler.destroy();
    }
}
