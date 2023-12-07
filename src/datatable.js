import DataTable from 'datatables.net-dt'
import 'datatables.net-buttons'
import {
    Graph
} from './Graph.js'
const pm = new Graph()
const data = Object.values(pm.nodes)

function allInputsEmpty() {
    console.log('allInputsEmpty')
    let inputs = document.querySelectorAll('#principia-table input')
    for (let input of inputs) {
      if (input.value.trim() !== '') {
        return false
      }
    }
    return true
}

function exportJson() {
    const filteredData = table.rows({
        filter: 'applied'
    }).data().toArray()
    const jsonString = JSON.stringify(filteredData, null, 2)
    const blob = new Blob([jsonString], {
        type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'principia-mathematica.json'
    a.click()
    URL.revokeObjectURL(url)
}

function exportCsv() {
    const columnNames = ["id", "type", "number", "page", "section", "volume", "chapter", "part", "provenBy", "proves"]
    const csvData = []
    const filteredData = table.rows({
        filter: 'applied'
    }).data().toArray()
    csvData.push(columnNames.join(','))
    for (const item of filteredData) {
        const proves = item.proves.join(',')
        const provenBy = item.provenBy.join(',')
        const csvRow = [
            item.id,
            item.properties.type,
            item.properties.number,
            item.properties.page,
            item.properties.section,
            item.properties.volume,
            item.properties.chapter,
            item.properties.part,
            `"${provenBy}"`,
            `"${proves}"`
        ]
        csvData.push(csvRow.join(','))
    }
    const csvString = csvData.join('\n')
    const blob = new Blob([csvString], {
        type: "text/csv"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'principia-mathematica.csv'
    a.click()
    URL.revokeObjectURL(url)
}

export let table = new DataTable('#principia-table', {
    data: data,
    pageLength: 10,
    dom: 'Blfrtip',
    buttons: [{
            text: 'Export CSV',
            className: 'btn export-btn btn-light btn-sm',
            action: function(e, dt, node, config) {
                exportCsv()
            },
        },
        {
            text: 'Export JSON',
            className: 'btn export-btn btn-light btn-sm',
            action: function(e, dt, node, config) {
                exportJson()
            },
        },
    ],
    columns: [{
            data: 'id',
            title: 'ID'
        },
        {
            data: 'properties.type',
            title: 'Type'
        },
        {
            data: 'properties.number',
            title: 'Number'
        },
        {
            data: 'properties.page',
            title: 'Page',
            render: function(data, type, row) {
                return '<div style="max-width: 100px overflow-x: auto">' + (data || '') + '</div>'
            },
        },
        {
            data: 'properties.section',
            title: 'Section'
        },
        {
            data: 'properties.volume',
            title: 'Volume'
        },
        {
            data: 'properties.chapter',
            title: 'Chapter'
        },
        {
            data: 'properties.part',
            title: 'Part'
        },
        {
            data: 'provenBy',
            title: 'Its proof cites...',
            render: function(data, type, row) {
                return '<div style="max-width: 200px overflow-x: auto">' + (data || '') + '</div>'
            },
        },
        {
            data: 'proves',
            title: 'Cited in proof of...',
            render: function(data, type, row) {
                return '<div style="max-width: 100px overflow-x: auto">' + (data || '') + '</div>'
            },
        },
    ],
    initComplete: function() {
        this.api().columns().every(function() {
            let column = this
            let title = column.header().textContent
            let input = document.createElement('input')
            input.placeholder = title
            column.header().replaceChildren(input)
            
            input.addEventListener('keyup', function() {
                if (column.search() !== this.value) {
                    // use exact matches for filtering
                    column.search('^' + this.value + '$', true, false).draw()
                }

                if (allInputsEmpty()) {
                    column.search('').draw()
                }
            })
        })
    }
})