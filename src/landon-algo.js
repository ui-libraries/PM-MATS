import { Graph, NodeVisualizer, GraphVisualizer } from './functions'

let n = 0
let w = 0
let x = 1
let y = 1
let chapter = 1
let chapX = 1
let oldX = 1
let oldY = 1
let xPosition = 10
let yPosition = 10
const PAD = 30

function isEven(num) {
    num = Number(num)
    return num % 2 === 0
  }
  
  function isOdd(num) {
    num = Number(num)
    return num % 2 !== 0
  }

function weight(number) {
    if (number % 1 === 0) return 0
    let len = number.toString().split('.')[1].length
    return Number(len)
}

function getPreviousNode(node) {
    let id = Number(node.id) - 1
    return pm.nodes[id]
}

let pm = new Graph('pm.json')
let nodes = Object.values(pm.nodes)
nodes.sort((a, b) => a.properties.chapter - b.properties.chapter)
nodes.forEach(n => {
    n.x = x
    n.y = y
    if (n.properties.chapter === chapter) {
        if (weight(n.properties.number) === w) {
            if (isOdd(weight(n.properties.number))) {
                let prev = getPreviousNode(n)
                oldX = prev.x
                y = y + PAD
                new NodeVisualizer(n, x, y).draw('canvas')
                n.x = x
                n.y = y
            } else if (isEven(weight(n.properties.number))) {
                let prev = getPreviousNode(n)
                x = x + PAD
                new NodeVisualizer(n, x, y).draw('canvas')
                n.x = x
                n.y = y
            }
        } else if (weight(n.properties.number) !== w) {
            w = weight(n.properties.number)
            y = oldY
            x = oldX
        }
    } else if (n.properties.chapter !== chapter) {
        chapter = n.properties.chapter
        chapX = chapX + PAD
        x = chapX
        y = 1
        oldY = n.y
        oldX = n.x
        new NodeVisualizer(n, chapX, PAD).draw('canvas')
    }
})