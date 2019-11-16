/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StyleTable = styled.div`

    table, th, td {
        border: 1px solid #999999;
    }

    #stats-table {
        text-align: left;
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 800px;
    }

    th {
        color: #5974c4;
        text-align: left;
        font-family: arial, sans-serif;
        padding: 10px;
        height: 40px;
        background-color: #ddd;
    }

    td {
        color: #cd5686;
        padding: 12px;
    }

    tr:hover {
        background-color: #f5f5f5;
    }
`;

class StatTable extends React.Component {
    constructor(props) {
        super(props);
        // data for the table.
        this.state = {
            data: [],
            tableHeader: ['Response Type', 'Value', 'Drug', 'Model', 'Patient'],
        };
        this.createTable = this.createTable.bind(this);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    componentWillMount() {
        axios.get('/api/v1/stats?patient=X-1004&drug=BGJ398')
            .then((response) => {
                this.parseData(response);
            });
    }

    parseData(response) {
        this.setState({
            data: response.data,
        });
    }

    createTable() {
        // this will create the table data (each row for corresponding data).
        const { data } = this.state;
        const table = data.map((eachdata, index) => {
            const {
                response_type, value, drug_name, model, patient,
            } = eachdata;
            return (
                <tr key={index}>
                    <td>{response_type}</td>
                    <td>{value}</td>
                    <td>{drug_name}</td>
                    <td>{model}</td>
                    <td>{patient}</td>
                </tr>
            );
        });
        return table;
    }

    createTableHeader() {
        // create the header for the table.
        const { tableHeader } = this.state;
        const header = tableHeader.map((key, index) => <th key={index}>{key.toUpperCase()}</th>);
        return header;
    }

    render() {
        return (
            <div className="curve-wrapper" style={{ marginTop: '10px', padding: '50px 0px' }}>
                <h1 id="title">Statistics (Response Evaluation)</h1>
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


export default StatTable;
