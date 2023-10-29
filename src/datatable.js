import DataTable from 'datatables.net-dt'
import 'datatables.net-buttons'
import { Graph } from './Graph.js'
const pm = new Graph()
const data = Object.values(pm.nodes)

function exportJson () {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'principia-mathematica.json'
    a.click()
    URL.revokeObjectURL(url)
}
 
export let table = new DataTable('#principia-table', {
    data: data,
    dom: 'Blfrtip',
    buttons: [
        {
            text: 'Export data',
            className: 'btn export-btn',
            action: function ( e, dt, node, config ) {
                exportCsv()
            }
        }
    ],
    columns: [
        { data: 'id', title: 'ID' },
        { data: 'properties.type', title: 'Type' },
        { data: 'properties.number', title: 'Number' },
        { data: 'properties.page', title: 'Page' },
        { data: 'properties.section', title: 'Section' },
        { data: 'properties.volume', title: 'Volume' },
        { data: 'properties.chapter', title: 'Chapter' },
        { data: 'properties.part', title: 'Part' },
        { 
            data: 'provenBy', 
            title: 'Its proof cites...', 
            render: function(data, type, row) { 
                return '<div style="max-width: 200px; overflow-x: auto;">' + (data || "") + '</div>';
            }
        },
        { 
            data: 'proves', 
            title: 'Cited in proof of...', 
            render: function(data, type, row) { 
                return '<div style="max-width: 100px; overflow-x: auto;">' + (data || "") + '</div>';
            }  
        }
    ],
    initComplete: function () {
        this.api()
            .columns()
            .every(function () {
                let column = this
                let title = column.footer().textContent
 
                // Create input element
                let input = document.createElement('input')
                input.placeholder = title
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












