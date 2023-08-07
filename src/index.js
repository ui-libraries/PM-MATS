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