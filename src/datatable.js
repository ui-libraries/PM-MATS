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
    ],
    initComplete: function () {
        this.api()
            .columns()
            .every(function () {
                let column = this
                let title = column.footer().textContent
 
                // Create input element
                let input = document.createElement('input')
                input.placeholder = title;
                column.header().replaceChildren(input)
 
                // Event listener for user input
                input.addEventListener('keyup', () => {
                    if (column.search() !== this.value) {
                        column.search(input.value).draw()
                    }
                })
            })
    }
})




