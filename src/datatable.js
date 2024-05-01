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
    const columnNames = ["id", "type", "volume", "part", "section", "chapter", "number", "page", "provenBy", "proves"]
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
            item.properties.volume,
            item.properties.part,
            item.properties.section,
            item.properties.chapter,
            item.properties.number,
            item.properties.page,        
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
    responsive: true,
    pageLength: 250,
    pagingType: 'simple_numbers',
    dom: 'Bfrtip',
    autoWidth: false,
    lengthMenu: [
        [250]
    ],
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
    columns: [
        {
            data: 'id',
            title: 'ID',
            className: 'column-width'
        },
        {
            data: 'properties.type',
            title: 'Type',
            className: 'column-width'
        },
        {
            data: 'properties.volume',
            title: 'Volume',
            className: 'column-width'
        },
        {
            data: 'properties.part',
            title: 'Part',
            className: 'column-width'
        },
        {
            data: 'properties.section',
            title: 'Section',
            className: 'column-width'
        },
        {
            data: 'properties.chapter',
            title: 'Chapter',
            className: 'column-width'
        },
        {
            data: 'properties.number',
            title: 'Number',
            className: 'column-width'
        },
        {
            data: 'properties.page',
            title: 'Page',
            className: 'column-width'
        },
        {
            data: 'provenBy',
            title: 'Its proof cites...',
            className: 'column-width-proofs-by',
            render: function(data, type, row) {
                let dataArray = Array.isArray(data) ? data : [data]
                let formattedData = dataArray.join(', ')
                return '<div style="max-width: 100%; max-height: 16rem; word-wrap: break-word; overflow-y: auto;">' + (formattedData || '') + '</div>'
            },
        },
        {
            data: 'proves',
            title: 'Cited in proof of...',
            className: 'column-width-proofs',
            render: function(data, type, row) {
                let dataArray = Array.isArray(data) ? data : [data]
                let formattedData = dataArray.join(', ')
                return '<div style="max-width: 100%; max-height: 16rem; word-wrap: break-word; overflow-y: auto;">' + (formattedData || '') + '</div>'
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