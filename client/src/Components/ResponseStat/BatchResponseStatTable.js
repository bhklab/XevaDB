/* eslint-disable react/no-array-index-key */
/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import StyleTable from './ModelResponseStyle';

class BatchStatTable extends React.Component {
    constructor(props) {
        super(props);
        // data for the table.
        this.state = {
            tableHeader: ['Batch', 'TGI', 'Angle', 'ABC'],
        };
        this.createTable = this.createTable.bind(this);
        this.createTableHeader = this.createTableHeader.bind(this);
    }

    createTable() {
        // this will create newData array of objects for the table.
        const { data } = this.props;
        const newData = [];
        let total = 0;
        let batchId = '';

        data.forEach((eachdata) => {
            if (newData.length === 0 || batchId !== eachdata.batch_id) {
                newData.push({});
                batchId = eachdata.batch_id;
                newData[total].batch = eachdata.batch;
                total += 1;
            }
            newData[total - 1][eachdata.response_type] = eachdata.value;
        });

        const table = newData.map((eachdata, index) => {
            const {
                batch, angle, TGI, abc,
            } = eachdata;
            return (
                <tr key={index}>
                    <td>{batch}</td>
                    <td>{TGI}</td>
                    <td>{angle}</td>
                    <td>{abc}</td>
                </tr>
            );
        });
        return table;
    }

    createTableHeader() {
        // create the header for the table.
        const { tableHeader } = this.state;
        const header = tableHeader.map((key, index) => <th key={index}>{key}</th>);
        return header;
    }

    render() {
        return (
            <div className="curve-wrapper" style={{ marginTop: '0px', padding: '60px 0px 20px 0px' }}>
                <h1 id="title">Statistics (Batch Response)</h1>
                <StyleTable>
                    <table id="stats-table">
                        <tbody>
                            <tr>{this.createTableHeader()}</tr>
                            {this.createTable()}
                        </tbody>
                    </table>
                </StyleTable>
            </div>
        );
    }
}


BatchStatTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BatchStatTable;
