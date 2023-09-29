import { Graph, NodeVisualizer } from './functions'
import { table } from './datatable.js'

let pm = new Graph('pm.json')
let node = pm.getNodeByNumber('2.521')
let node2 = pm.getNodeByNumber('2.52')
let children = pm.getChildrenIdsByNumber('2.5')
let visualizer = new NodeVisualizer(node, 20, 20)
let visualizer2 = new NodeVisualizer(node2, 60, 60)
visualizer.draw('canvas')
visualizer2.draw('canvas', 'blue')

console.log("children: " + children)
console.log(pm.getParentIdByNumber('2.37'))
console.log(pm.getNodesByProperties({"page":"105"}))
console.log(visualizer.getLevel())

/*
children: 51,52,54,55,56,57
34
Array(5)0: Node {id: '36', properties: {…}, proves: Array(5), provenBy: Array(4)}1: Node {id: '37', properties: {…}, proves: Array(0), provenBy: Array(0)}2: Node {id: '38', properties: {…}, proves: Array(0), provenBy: Array(3)}3: Node {id: '39', properties: {…}, proves: Array(0), provenBy: Array(3)}4: Node {id: '40', properties: {…}, proves: Array(6), provenBy: Array(3)}length: 5[[Prototype]]: Array(0)
3
*/

