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

    constructor(private http: HttpClient) {

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
        // Fonction temp
        /*this.readFileContent('./diagrams/diagram_V1.bpmn')
        .then((xmlContent) => {
            console.log("ON a le fichier !");
            this.displayDiagram(xmlContent);
        })
        .catch((error) => {
            console.log("PB de lecture" + error);
        });*/
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

    readFileContent(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!file) {
                resolve('');
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const text = reader.result.toString();
                resolve(text);

            };

            reader.readAsText(file);
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

    ngOnDestroy(): void {
        this.bpmnJS.destroy();
    }
}
