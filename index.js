const fs = require('fs');
const createElement = require('./apiTrello/createProcess');

var readBPMN = require('./readDiagram/readBPMN.js');

//Charger le fichier
var xmlContent = fs.readFileSync('./diagrams/diagram_V1.bpmn','utf8');

readBPMN.getElementfromDiagram(xmlContent).then((data) => {
        var tasks = data.tasks;
        var boardName = data.boardName;
		console.log(JSON.stringify(tasks));
		
		//createElement.getToken();

        //Création du board
        createElement.createBoard(boardName)
            .then((idBoard) => {
				createElement.createList(idBoard, tasks)
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log('ERREUR'+ error);
				})
			})
			.catch((error) => {
				console.log(error);
			});

});


