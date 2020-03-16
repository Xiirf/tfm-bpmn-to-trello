import {
    AfterContentInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    Input
  } from '@angular/core';

import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
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

export class BpmnComponent implements AfterContentInit, OnDestroy {
    // instantiate BpmnJS with component
    bpmnJS: BpmnJS;
    @Input() selectedOrg: Organization;

    // retrieve DOM element reference
    @ViewChild('ref', {static: true}) private el: ElementRef;

    constructor(private http: HttpClient,
                private sanitizer: DomSanitizer,
                private generateService: GenerateService,
                private toastr: ToastrService) {

        this.bpmnJS = new BpmnJS();

        this.bpmnJS.on('import.done', ({ error }) => {
          if (!error) {
            this.bpmnJS.get('canvas').zoom('fit-viewport');
          }
        });
    }

    ngAfterContentInit(): void {
        // attach BpmnJS instance to DOM element
        this.bpmnJS.attachTo(this.el.nativeElement);
        this.loadXML();
    }

    drop(event) {
        if (event.dataTransfer.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                console.log(reader.result);
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
        this.bpmnJS.importXML(xml, (err, warnings) => {
            if (err) {
                this.toastr.error(err);
            }
            this.toastr.success('Diagram displayed');
        });
    }

    genTrello() {
        this.bpmnJS.saveXML((err: any, xml: any) => {
            if (!err) {
                this.generateService.generateTrello(this.selectedOrg.name, xml)
                .then((resp) => { this.toastr.success(resp.message); })
                .catch((error) => {
                    this.toastr.error(error.error.msg);
                });
            }
        });
    }

    saveSVG() {
        this.bpmnJS.saveSVG((err: any, svg: any) => {
            if (!err) {
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                saveAs(blob, 'diagram.svg');
            }
        });
    }

    saveDiagram() {
        this.bpmnJS.saveXML((err: any, xml: any) => {
            if (!err) {
                const blob = new Blob([xml], { type: 'image/svg+xml' });
                saveAs(blob, 'diagram.bpmn');
            }
        });
    }

    ngOnDestroy(): void {
        this.bpmnJS.destroy();
    }
}
