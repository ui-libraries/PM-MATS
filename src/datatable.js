import DataTable from 'datatables.net-dt'
import { Graph } from './functions'
let pm = new Graph('pm.json')
let data = Object.values(pm.nodes)
 
export let table = new DataTable('#principia-table', {
    data: data,
    columns: [
        { data: 'id', title: 'ID' },
        { data: 'properties.type', title: 'Type' },
        { data: 'properties.number', title: 'Number' },
        { data: 'properties.page', title: 'Page' },
        { data: 'properties.section', title: 'Section' },
        { data: 'properties.volume', title: 'Volume' },
        { data: 'properties.chapter', title: 'Chapter' },
        { data: 'properties.part', title: 'Part' }
    ]
})




