/* eslint-disable max-len */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import React from 'react';
import axios from 'axios';
import StyleTable from './ModelResponseStyle';

class StatTable extends React.Component {
    constructor(props) {
        super(props);
        // data for the table.
        this.state = {
            data: [],
            tableHeader: ['Patient', 'Model', 'Drug', 'mRECIST', 'Slope', 'AUC', 'Best Average Response'],
        };
        this.createTable = this.createTable.bind(this);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    componentWillMount() {
        const { drugParam, patientParam } = this.props;
        axios.get(`/api/v1/stats?patient=${patientParam}&drug=${drugParam}`)
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

        // this will create newData array of objects for the table.
        const newData = [];
        let total = 0;
        let drugValue = '';
        let modelValue = '';

        data.forEach((eachdata) => {
            if (newData.length === 0 || drugValue !== eachdata.drug_name || modelValue !== eachdata.model) {
                newData.push({});
                drugValue = eachdata.drug_name;
                modelValue = eachdata.model;
                newData[total].model = modelValue;
                newData[total].drug = drugValue;
                newData[total].patient = eachdata.patient;
                total += 1;
            }
            newData[total - 1][eachdata.response_type === 'best.average.response' ? 'bar' : eachdata.response_type] = eachdata.value;
        });

        const table = newData.map((eachdata, index) => {
            const {
                patient, model, drug, bar, mRECIST, slope, AUC,
            } = eachdata;
            return (
                <tr key={index}>
                    <td>{patient}</td>
                    <td>{model}</td>
                    <td>{drug}</td>
                    <td>{bar}</td>
                    <td>{mRECIST}</td>
                    <td>{slope}</td>
                    <td>{AUC}</td>
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
            <div className="curve-wrapper" style={{ marginTop: '0px', padding: '60px 0px' }}>
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
