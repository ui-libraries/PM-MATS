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

class Graph {
    constructor(filePath) {
        this.nodes = {};
        if (filePath) {
            this._loadJson(filePath);
        }
    }

    _loadJson(filePath) {
        let data = fs.readFileSync(filePath);
        let jsonData = JSON.parse(data);
    
        jsonData.forEach(obj => {
            if (obj.type === "node") {
                this._insertNode(obj);
            } else if (obj.type === "relationship" && obj.label === "Proves") {
                let startNode = this.nodes[obj.start.id];
                let endNode = this.nodes[obj.end.id];
    
                if (startNode && endNode) {
                    startNode.addProof(endNode);
                    endNode.addProofFor(startNode);
                }
            }
        });
    }

    _insertNode(obj) {
        let node = new Node(obj.id, obj.properties);
        this.nodes[node.id] = node;
    }

    getNodeByNumber(number) {
        for (let id in this.nodes) {
            let node = this.nodes[id];
            if (node.properties.number === number) {
                return node;
            }
        }
        return null;
    }

    getNodeById(id) {
        return this.nodes[id] || null;
    }

    getChildrenIdsByNumber(number) {
        let childrenIds = [];
    
        let numberParts = number.split('');
    
        Object.values(this.nodes).forEach(node => {
            let nodeNumberParts = node.properties.number.split('');
            let matches = nodeNumberParts.slice(0, numberParts.length).every((part, index) => part === numberParts[index]);
    
            if (matches && nodeNumberParts.length === numberParts.length + 1) {
                childrenIds.push(node.id);
            }
        });
    
        // Sort by decimal number (so "2.01" comes before "2.1")
        childrenIds.sort((a, b) => {
            return parseFloat(this.nodes[a].properties.number) - parseFloat(this.nodes[b].properties.number);
        });
    
        return childrenIds;
    }

    getParentIdByNumber(number) {
        let inputNodeExists = Object.values(this.nodes).some(node => node.properties.number === number);
        if (!inputNodeExists) {
            console.log(`No node exists with the number ${number}`);
            return null;
        }
    
        let parentNumber;
        let numberParts = number.split(".");
        if (numberParts[1] && numberParts[1].length > 1) {
            parentNumber = `${numberParts[0]}.${numberParts[1].slice(0, -1)}`;
        }
    
        let parentId = null;
        Object.values(this.nodes).forEach(node => {
            if (node.properties.number === parentNumber) {
                parentId = node.id;
            }
        });
    
        if (parentId === null) {
            console.log(`No parent node exists for the number ${number}`);
        }
    
        return parentId;
    }

    toJsonFile(filename) {
        let jsonContent = JSON.stringify(this.nodes, null, 2);
    
        fs.writeFile(filename, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occurred while writing JSON object to file.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
    }

    getNodesByProperties(desiredProperties) {
        let matchingNodes = [];
    
        Object.values(this.nodes).forEach(node => {
            let matchesAll = true;
            
            // Check if the node contains all properties from desiredProperties
            for (let property in desiredProperties) {
                if (node.properties[property] !== desiredProperties[property]) {
                    matchesAll = false;
                    break;
                }
            }
    
            // If the node matches all desired properties, add it to matchingNodes
            if (matchesAll) {
                matchingNodes.push(node);
            }
        });
    
        return matchingNodes;
    }
}

let pm = new Graph('pm.json');
let node = pm.getNodeByNumber('2.5');
let children = pm.getChildrenIdsByNumber('2.5');
console.log(children);

console.log(pm.getParentIdByNumber('2.37'));
console.log(pm.getNodesByProperties({"page":"105"}));