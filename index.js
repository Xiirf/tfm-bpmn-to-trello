const fs = require('fs');

var readBPMN = require('./readDiagram/readBPMN.js');

//Charger le fichier
var xmlContent = fs.readFileSync('./diagrams/diagram_V1.bpmn','utf8');

readBPMN.getElementfromDiagram(xmlContent).then((data) => {
        var tasks = data.tasks;
        var boardName = data.boardName;
        console.log(JSON.stringify(tasks));
});

