/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import React from 'react';
import axios from 'axios';

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

    componentDidMount() {
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
        const { data } = this.state;
        const table = data.map((eachdata) => {
            const {
                response_type, value, drug_name, model, patient,
            } = eachdata;
            return (
                <tr>
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
        const header = tableHeader.map((key) => <th>{key.toUpperCase()}</th>);
        return header;
    }

    render() {
        return (
            <div>
                <h1 id="title">Statistics (Response Evaluation)</h1>
                <table id="students">
                    <tbody>
                        <tr>{this.createTableHeader()}</tr>
                        {this.createTable()}
                    </tbody>
                </table>
            </div>
        );
    }
}


export default StatTable;
