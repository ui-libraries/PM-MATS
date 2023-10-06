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
        { data: 'properties.part', title: 'Part' },
        { 
            data: 'provenBy', 
            title: 'Proven By', 
            render: function(data, type, row) { 
                return '<div style="max-width: 200px; overflow-x: auto;">' + (data || "") + '</div>';
            }
        },
        { 
            data: 'proves', 
            title: 'Proves', 
            render: function(data, type, row) { 
                return '<div style="max-width: 100px; overflow-x: auto;">' + (data || "") + '</div>';
            }  
        }
    ],    
    columnDefs: [
        { width: '100px', targets: 8 },  // Targets first column
        { width: '150px', targets: 9 },  // Targets second column
        // ... and so on for other specific columns
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

/*
$(document).ready(function() {
    $("tbody tr").each(function() {
        $(this).find("td:nth-last-child(1), td:nth-last-child(2)").each(function() {
            var originalContent = $(this).text().trim()

            // Only create a dropdown if there's data in the cell
            if (originalContent) {
                var values = originalContent.split(',')

                var dropdownHtml = '<select class="custom-dropdown">'
                values.forEach(function(value) {
                    dropdownHtml += '<option value="' + value.trim() + '">' + value.trim() + '</option>'
                })
                dropdownHtml += '</select>'

                $(this).html(dropdownHtml)
            }
        })
    })
})
*/













