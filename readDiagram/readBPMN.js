//Camaro
const { transform } = require('camaro')
var tasks = []; 

getElementfromDiagram = async (xmlContent) => {
    const result = await readBPMNToJson(xmlContent)
    const root = result.elem[0];
    const sequence = root.sequenceFlow

    var boardName = root.boardName;

    // Fill tasks with start + tasks + end and add pos
    getAllTasks(root);


    //pos
    for (var i = sequence.length-1; i >= 0; i--) {
        setTaskPos(sequence[i].target, getTaskPos(sequence[i].source) +1 );
    }

    return {
        boardName: boardName,
        tasks: tasks
    }
}

getAllTasks = (root) => {
    tasks.push({
        name: root.startEvent.name,
        id: root.startEvent.id,
        pos: 1
    });

    root.tasks.forEach(task => {
        tasks.push({
            name: task.name,
            id: task.id,
            pos: 0
        });
    });

    tasks.push({
        name: root.endEvent.name,
        id: root.endEvent.id,
        pos: 1
    });
}

getTaskPos = (id) => {
    return tasks.find(task => task.id === id).pos;
}

setTaskPos = (id, pos) => {
    tasks.find(task => task.id === id).pos = pos;
}


readBPMNToJson = async function (xmlContent) {
    return result = await transform(xmlContent, {
        elem: [
            '/definitions',
            {
                boardName: 'collaboration/participant/@name',
                startEvent: {
                    name: 'process/startEvent/@name',
                    id: 'process/startEvent/@id'
                },
                tasks: ['process/task', {
                    id: '@id',
                    name: '@name'
                }],
                sequenceFlow: ['process/sequenceFlow', {
                    source: '@sourceRef',
                    target: '@targetRef'
                }],
                endEvent: {
                    name: 'process/endEvent/@name',
                    id: 'process/endEvent/@id'
                },
            }
        ]
    })
}

module.exports = {
    getElementfromDiagram,
}
