const express = require('express');
const path = require('path');
const ngApp = express();
const cors = require('cors');

ngApp.use(cors());
ngApp.use(express.static('./dist/tfm-bpmn-to-trello'));
ngApp.get('/*', function (request, response) {
    response.sendFile(path.join(__dirname, '/dist/tfm-bpmn-to-trello/index.html'));
});
ngApp.listen(process.env.PORT || 8080);