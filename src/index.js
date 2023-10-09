import { Graph, NodeVisualizer, GraphVisualizer } from './functions'
import { table } from './datatable.js'
import data from './pm.json'

function branch(chapter, startingX = 0, startingY = 0) {
    // Filter nodes based on the given chapter
    let chapter_nodes = data.filter(obj => obj.type === "node" && Math.floor(parseFloat(obj.properties.number)) === chapter)
    
    // Sort the nodes by their number property
    chapter_nodes.sort((a, b) => {
        let numA = parseFloat(a.properties.number)
        let numB = parseFloat(b.properties.number)
        return numA - numB || a.properties.number.localeCompare(b.properties.number)
    })

    let x = startingX
    let y = startingY
    let lastPrimaryNode = startingX

    for (let node of chapter_nodes) {
        console.log(node.properties.number)
        
        let parts = node.properties.number.split(".")
        let mantissa = parts[1]
        let mantissaLength = mantissa ? mantissa.length : 0

        if (mantissaLength === 0) {  // For nodes like 2.0, 3.0...
            node.x = x
            node.y = y
        } else if (mantissaLength === 1) {  // For nodes like 2.1, 2.2...
            y += 50
            x = lastPrimaryNode
            node.x = x
            node.y = y
        } else if (mantissaLength === 2) {  // For nodes like 2.01, 2.02...
            x += 50
            node.x = x
            node.y = y
        } else if (mantissaLength === 3) {  // For nodes like 2.621
            y += 50
            node.x = x
            node.y = y
        }   
        
        if (mantissa === '0') {
            lastPrimaryNode = x
        }

        new NodeVisualizer(node, node.x, node.y).draw("canvas", "red")
    }

    return chapter_nodes
}

branch(2, 0, 0)


