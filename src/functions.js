import { data } from './pm'
import { SVG } from '@svgdotjs/svg.js'

export class NodeVisualizer {
    constructor(node, x = 0, y = 0) {
        this.node = node
        this.x = x
        this.y = y
    }

    getLevel() {
        const decimalPart = this.node.properties.number.split('.')[1]
        return decimalPart ? decimalPart.length : 0
    }

    getPosition() {
        // Define constants for vertical and horizontal spacing
        const VERTICAL_SPACING = 50
        const HORIZONTAL_SPACING = 50

        // Calculate new position based on level
        const level = this.getLevel()

        if (level === 0) {
            // If the node is a root node (level 0), leave its position as is
            return [this.x, this.y]
        } else if (level % 2 === 1) {
            // If the level is odd, position the node vertically
            return [this.x, this.y + VERTICAL_SPACING]
        } else {
            // If the level is even, position the node horizontally
            return [this.x + HORIZONTAL_SPACING, this.y]
        }
    }

    draw(containerId, color) {
        const [x, y] = this.getPosition()
        // Define circle attributes
        const circleRadius = 10

        const draw = SVG().addTo(`#${containerId}`).size('100%', '100%')
        const circle = draw.circle(circleRadius * 2).move(x, y).fill(color || 'red')
        const text = draw.text(this.node.properties.number.toString()).font({
            fill: 'black',
            family: 'Inconsolata',
            size: 12
        })

        // Get the text box to find its dimensions
        const textBox = text.bbox()

        // Calculate positions for centering the text above the circle
        const textX = x + circleRadius - textBox.width / 2
        const textY = y - textBox.height

        // Move the text to the calculated position
        text.move(textX, textY)

        circle.on('click', () => {
            console.log(`Node ${this.node.id} was clicked!`)
        })
    }
}
  

export class Node {
    constructor(id, properties = {}) {
        this.id = id
        this.properties = properties
        this.proves = []
        this.provenBy = []
    }

    addProof(node) {
        this.proves.push(node.id)
    }

    addProofFor(node) {
        this.provenBy.push(node.id)
    }
}

export class Graph {
    constructor() {
        this.nodes = {}
        this._loadJson()
        
    }

    _loadJson() {   
        data.forEach(obj => {
            if (obj.type === "node") {
                this._insertNode(obj)
            } else if (obj.type === "relationship" && obj.label === "Proves") {
                let startNode = this.nodes[obj.start.id]
                let endNode = this.nodes[obj.end.id]
    
                if (startNode && endNode) {
                    startNode.addProof(endNode)
                    endNode.addProofFor(startNode)
                }
            }
        })
    }

    _insertNode(obj) {
        let node = new Node(obj.id, obj.properties)
        this.nodes[node.id] = node
    }

    getNodeByNumber(number) {
        for (let id in this.nodes) {
            let node = this.nodes[id]
            if (node.properties.number === number) {
                return node
            }
        }
        return null
    }

    getNodeById(id) {
        return this.nodes[id] || null
    }

    getChildrenIdsByNumber(number) {
        let childrenIds = []
    
        let numberParts = number.split('')
    
        Object.values(this.nodes).forEach(node => {
            let nodeNumberParts = node.properties.number.split('')
            let matches = nodeNumberParts.slice(0, numberParts.length).every((part, index) => part === numberParts[index])
    
            if (matches && nodeNumberParts.length === numberParts.length + 1) {
                childrenIds.push(node.id)
            }
        })
    
        // Sort by decimal number (so "2.01" comes before "2.1")
        childrenIds.sort((a, b) => {
            return parseFloat(this.nodes[a].properties.number) - parseFloat(this.nodes[b].properties.number)
        })
    
        return childrenIds
    }

    getParentIdByNumber(number) {
        let inputNodeExists = Object.values(this.nodes).some(node => node.properties.number === number)
        if (!inputNodeExists) {
            console.log(`No node exists with the number ${number}`)
            return null
        }
    
        let parentNumber
        let numberParts = number.split(".")
        if (numberParts[1] && numberParts[1].length > 1) {
            parentNumber = `${numberParts[0]}.${numberParts[1].slice(0, -1)}`
        }
    
        let parentId = null
        Object.values(this.nodes).forEach(node => {
            if (node.properties.number === parentNumber) {
                parentId = node.id
            }
        })
    
        if (parentId === null) {
            // console.log(`No parent node exists for the number ${number}`)
        }
    
        return parentId
    }

    /*
    toJsonFile(filename) {
        let jsonContent = JSON.stringify(this.nodes, null, 2)
    
        fs.writeFile(filename, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occurred while writing JSON object to file.")
                return console.log(err)
            }
            console.log("JSON file has been saved.")
        })
    } */

    getNodesByProperties(desiredProperties) {
        let matchingNodes = []
    
        Object.values(this.nodes).forEach(node => {
            let matchesAll = true
            
            // Check if the node contains all properties from desiredProperties
            for (let property in desiredProperties) {
                if (node.properties[property] !== desiredProperties[property]) {
                    matchesAll = false
                    break
                }
            }
    
            // If the node matches all desired properties, add it to matchingNodes
            if (matchesAll) {
                matchingNodes.push(node)
            }
        })
    
        return matchingNodes
    }
}