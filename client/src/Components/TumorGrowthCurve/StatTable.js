/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-deprecated */
import React from 'react';
import * as d3 from 'd3';

class StatTable extends React.Component {
    constructor(props) {
        super(props);
        // data for the table.
        this.state = {
            data: [],
        };
        this.createTable = this.createTable.bind(this);
    }

    componentDidMount() {
        this.createTable();
    }

    createTable() {
        const { node } = this;
        console.log(node);
        const dimensions = { height: 500, width: 500 };
        const margin = {
            top: 200, right: 200, bottom: 20, left: 250,
        };

        const dataset = [
            {
                rank: 1,
                country: 'xyz',
                company: 'wao',
                sales: 4,
            },
            {
                rank: 2,
                country: 'aaxyz',
                company: 'aawao',
                sales: 44,
            },
        ];

        // make the SVG element.
        const svg = d3.select(node)
            .append('svg')
            .attr('id', 'data-table')
            .attr('xmlns', 'http://wwww.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
            .attr('height', dimensions.height + margin.bottom + margin.top)
            .attr('width', dimensions.width + margin.left + margin.right);


        const table = svg.append('table');

        const thead = table.append('thead');

        const tbody = table.append('tbody');

        const date = ['rank', 'country', 'company', 'sale'];

        // append the header row.
        thead.append('tr')
            .selectAll('th')
            .data(date)
            .enter()
            .append('th')
            .text((d) => d)
            .attr('fill', 'red');

        // create row for each object.
        const rows = tbody.selectAll('tr')
            .data(dataset)
            .enter()
            .append('tr');

        // create cell for each row.
        const cells = rows.selectAll('td')
            .data((d) => dataset.map((col) => ({
                column: col,
                value: d[col],
            })))
            .enter()
            .append('td')
            .text((d) => d.value);
    }

    render() {
        return (
            // eslint-disable-next-line no-return-assign
            <div ref={(node) => this.node = node} className="stat-table" />
        );
    }
}

export default StatTable;
