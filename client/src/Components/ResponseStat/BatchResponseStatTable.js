/* eslint-disable react/no-array-index-key */
/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import { StyleTable, StyledLink } from './ResponseStyle';
import downloadIcon from '../../images/download.svg';

class BatchStatTable extends React.Component {
    constructor(props) {
        super(props);
        // data for the table.
        this.state = {
            tableHeader: ['Batch', 'TGI', 'Angle', 'ABC'],
        };
        this.createTable = this.createTable.bind(this);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    parseData(data) {
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

        return newData;
    }

    createTable(data) {
        return data.map((eachdata, index) => {
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
    }

    createTableHeader() {
        // create the header for the table.
        const { tableHeader } = this.state;
        const header = tableHeader.map((key, index) => <th key={index}>{key}</th>);
        return header;
    }

    render() {
        const { data } = this.props;
        const parsedData = this.parseData(data);
        const header = this.createTableHeader();
        const table = this.createTable(parsedData);
        return (
            <div className="curve-wrapper" style={{ paddingTop: '100px' }}>
                <StyledLink>
                    <h1 id="title" style={{ display: 'inline-block', margin: '5px' }}>Batch Response</h1>
                    <CSVLink data={data} filename="batchresponse.csv" style={{ float: 'right', display: 'inline-block' }}>
                        Export Data
                        <img src={downloadIcon} alt="download icon!" />
                    </CSVLink>
                </StyledLink>
                <StyleTable>
                    <table id="stats-table">
                        <tbody>
                            <tr>{header}</tr>
                            {table}
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
