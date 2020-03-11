import {
    AfterContentInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    OnChanges,
    SimpleChanges
  } from '@angular/core';

import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from '@progress/kendo-file-saver';

@Component({
  selector: 'app-bpmn',
  templateUrl: './bpmn.component.html',
  styleUrls: ['./bpmn.component.scss']
})

export class BpmnComponent implements AfterContentInit, OnDestroy, OnChanges {
    // instantiate BpmnJS with component
    private bpmnJS: BpmnJS;

    // retrieve DOM element reference
    @ViewChild('ref', {static: true}) private el: ElementRef;

    constructor(private http: HttpClient,
                private sanitizer: DomSanitizer) {

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
              console.log(err);
            } else {
                console.log(warnings);
            }
        });
    }


    ngOnChanges(changes: SimpleChanges) {
        // re-import whenever the url changes
        if (changes.url) {
          // this.loadUrl(changes.url.currentValue);
        }
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

    public getFile(event) {
        if (event.target.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = reader.result.toString();
                this.displayDiagram(text);
            };
            reader.readAsText(event.target.files[0]);
        }
    }

    ngOnDestroy(): void {
        this.bpmnJS.destroy();
    }
}
