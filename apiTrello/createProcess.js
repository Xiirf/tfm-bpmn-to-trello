const requestBase = require('./request');
require('dotenv').config();

var requestTrello = requestBase();
/*
exports.getToken = () => {
    const data = {
        expiration: '1day',
        name: 'TFM',
        scope: 'read,write',
        response_type: 'token',
    }
    setConfigKey(data);

    return requestTrello.get('/authorize', data)
        .then(resp => {
            console.log("OK " + JSON.stringify(resp));
            //return resp.data.id;
        })
        .catch(error => {
            console.log("PAS OK! " + JSON.stringify(error.response.data));
            //return (error.message + ' ( ' + error.response.statusText + ' ) : ' + error.response.data);
        })
}*/

exports.createBoard = (nameBoard) => {
    const data = {
        name: nameBoard,
        defaultLists: false,
        idOrganization: process.env.teamName
    }
    setConfigKey(data);
    return requestTrello.post('/boards', data)
    .then(resp => {
        console.log("Board : " + nameBoard + " created");
        return resp.data.id;
      })
    .catch(error => {
        return (error.message + ' ( ' + error.response.statusText + ' ) : ' + error.response.data);
    })
}

exports.createList =  async (idBoard, tasks) => {
    for (task of tasks) {
        const data = {
            name: task.name,
            idBoard: idBoard,
            pos: task.pos
        }
        setConfigKey(data);
        const error = await requestTrello.post('/lists', data)
        .then(resp => {
            console.log("List : " + task.name + " created");
        })
        .catch(error => {
            return (error.message + ' ( ' + error.response.statusText + ' ) : ' + error.response.data);
        })
        if (error) return(Error(error));
    };
    return('end');
}

function setConfigKey(data) {
    data.key = process.env.api_key;
    data.token = process.env.token;
    return data;
}