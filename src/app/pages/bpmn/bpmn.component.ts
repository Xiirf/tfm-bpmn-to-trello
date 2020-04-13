import {
    AfterContentInit,
    Component,
    ElementRef,
    OnInit,
    OnDestroy,
    ViewChild,
    Input
  } from '@angular/core';

import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import $ from 'jquery';
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

    drop(event) {
        if (event.dataTransfer.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = reader.result.toString();
                this.displayDiagram(text);
            };
            reader.readAsText(event.dataTransfer.files[0]);
        }
        event.preventDefault();
        event.stopPropagation();
    }

    allowDrop(event) {
        event.preventDefault();
    }

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

    genTrello() {
        this.bpmnModeler.saveXML((err: any, xml: any) => {
            if (!err) {
                this.generateService.generateTrello(this.selectedOrg.name, xml)
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

    saveSVG() {
        this.bpmnModeler.saveSVG((err: any, svg: any) => {
            if (!err) {
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                saveAs(blob, 'diagram.svg');
            }
        });
    }

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
