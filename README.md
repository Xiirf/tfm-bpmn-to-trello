# TfmBpmnToTrello

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.4.

User interface to interact with a BPMN diagram using Camunda and BPMN.io. Allows to generate a Trello dashboard from the BPMN diagram. Using API https://github.com/Xiirf/tfm-bpmn-to-trello-api

## Heroku deployment
https://tfm-bpmn-to-trello.herokuapp.com/

# Installation

## Local launch
npm install <br/>
npm run devMode (port 4201)

### Trello autorization
You have to add the url where you are using the app in your Trello origin (https://trello.com/app-key)
![alt text](https://i.imgur.com/nMcRekp.png)

## Setting
### Environmental variables
    - api_key: Trello API Keys for Developer (https://trello.com/app-key)<br/>
    - idPowerUp: PowerUp ID (https://trello.com/power-ups/admin)<br/>
    - urlAPI: Url tfm-bpmn-to-trello-api (https://github.com/Xiirf/tfm-bpmn-to-trello-api)<br/>

# Utilisation
![alt text](https://i.imgur.com/g6Hwagk.png)

## Authorization
You have to get the Trello token and then send it automatically to the API.<br/>
![alt text](https://i.imgur.com/VLFeUPZ.png)

## Team selection
The next step is to choose a team to create the board. <br/>
![alt text](https://i.imgur.com/oAwneBg.png)

## Diagramme BPMN
![alt text](https://i.imgur.com/6iAVkuA.png)

### Functionalities
The application has many functionalities such as the ability to directly import a diagram, create it and save it in svg or xml format. In addition, it is also possible to generate the Trello table corresponding to the diagram.

### Camunda
The diagram also has the functionality offered by Camunda to add features. (https://docs.camunda.org/get-started/quick-start/user-task/)

### Rules
In order to be able to generate the diagram on Trello you have to respect certain syntax rules such as: <br/>
- Each element must have a name,<br/>
- The diagram must contain at least one task and two elements of type startEvent and endEvent,<br/>
- Each form parameter must contain an id, a label and a type,<br/>
- The table name must be filled in as in the screen above (BoardTest),<br/>
- Each of the objects must have a link,<br/>
- A condition must use the same variable for each of these possibilities.

# Other information

## Author
Flavien Cocu

## Context
Master's final project, University of Seville, Master's degree in software engineering.
