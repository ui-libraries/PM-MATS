const fs = require('fs');

class Node {
    constructor(id, properties = {}) {
        this.id = id;
        this.properties = properties;
        this.proves = [];
        this.provenBy = [];
    }

    addProof(node) {
        this.proves.push(node.id);
    }

    addProofFor(node) {
        this.provenBy.push(node.id);
    }
}

function insertNode(nodes, nodeObj) {
    let node = new Node(nodeObj.id, nodeObj.properties);
    nodes[node.id] = node;
}

function loadNodesFromFile(filePath, nodes) {
    let data = fs.readFileSync(filePath);
    let jsonData = JSON.parse(data);

    jsonData.forEach(obj => {
        if (obj.type === "node") {
            insertNode(nodes, obj);
        }
    });
}

function loadRelationshipsFromFile(filePath, nodes) {
    let data = fs.readFileSync(filePath);
    let jsonData = JSON.parse(data);

    jsonData.forEach(obj => {
        if (obj.type === "relationship" && obj.label === "Proves") {
            let startNode = nodes[obj.start.id];
            let endNode = nodes[obj.end.id];

            if (startNode && endNode) {
                startNode.addProof(endNode);
                endNode.addProofFor(startNode);
            }
        }
    });
}

function getNodeByNumber(nodes, number) {
    for (let id in nodes) {
        let node = nodes[id];
        if (node.properties.number === number) {
            return node;
        }
    }
    return null;
}

function getNodeById(nodes, id) {
    return nodes[id] || null;
}

function getParent(nodes, node) {
    // Split the number into parts
    let parts = node.properties.number.split('.');

    // If the node is a root node, it has no parent
    if (parts.length < 2) {
        return null;
    }

    // Remove the last part to get the parent's number
    let parentNumber = parts.slice(0, parts.length - 1).join('.');

    return getNodeByNumber(nodes, parentNumber);
}

function getChildren(nodes, node) {
    let children = [];
    let childNumberPrefix = node.properties.number + '.';
    for (let id in nodes) {
        let childNode = nodes[id];
        if (childNode.properties.number.startsWith(childNumberPrefix)) {
            children.push(childNode);
        }
    }
    return children;
}

function getChildren(nodes, node) {
    let children = [];
    let childNumberPrefix = node.properties.number + '.';
    for (let id in nodes) {
        let childNode = nodes[id];
        if (childNode.properties.number.startsWith(childNumberPrefix)) {
            children.push(childNode);
        }
    }
    return children;
}

function getChildrenIdsByNumber(nodes, number) {
    let childrenIds = [];

    let numberParts = number.split('');

    Object.values(nodes).forEach(node => {
        let nodeNumberParts = node.properties.number.split('');
        let matches = nodeNumberParts.slice(0, numberParts.length).every((part, index) => part === numberParts[index]);

        if (matches && nodeNumberParts.length === numberParts.length + 1) {
            childrenIds.push(node.id);
        }
    });

    // Sort by decimal number (so "2.01" comes before "2.1")
    childrenIds.sort((a, b) => {
        return parseFloat(nodes[a].properties.number) - parseFloat(nodes[b].properties.number);
    });

    return childrenIds;
}






// Usage:
let nodes = {};
loadNodesFromFile('pm.json', nodes);
loadRelationshipsFromFile('pm.json', nodes);

// Usage:
let node = getNodeByNumber(nodes, "2.521");
let node2 = getNodeById(nodes, "50");
let parent = getParent(nodes, node); // Returns node with number "2.5"
let children = getChildrenIdsByNumber(nodes, "2.5"); // Returns ["2.51", "2.52", "2.53"]
console.log(children);