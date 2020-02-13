/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable class-methods-use-this */
import React from 'react';
import axios from 'axios';
import StyleTable from './ModelResponseStyle';
import BatchStatTable from './BatchResponseStatTable';

class StatTable extends React.Component {
    constructor(props) {
        super(props);
        // data for the table.
        this.state = {
            data: [],
            batchData: [],
            tableHeader: ['Patient', 'Model', 'Drug',
                'mRECIST', 'Best Average Response', 'Slope', 'AUC',
                'Survival (Days)', 'Link', 'Row Number'],
        };
        this.createTable = this.createTable.bind(this);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount() {
        const { drugParam, patientParam } = this.props;
        const getModelResponse = axios.get(`/api/v1/stats?patient=${patientParam}&drug=${drugParam}`, { headers: { Authorization: localStorage.getItem('user') } });
        const getBatchResponse = axios.get(`/api/v1/batchstat?patient=${patientParam}&drug=${drugParam}`, { headers: { Authorization: localStorage.getItem('user') } });

        Promise.all([getBatchResponse, getModelResponse]).then((response) => {
            this.parseData(response);
        });
    }

    parseData(response) {
        this.setState({
            data: response[1].data,
            batchData: response[0].data,
        });
        // if the dataset id is not 7 then table header won't include Link and Row Number.
        const { data } = this.state;
        if (data[0] && data[0].dataset_id !== 7) {
            this.setState({
                tableHeader: ['Patient', 'Model', 'Drug',
                    'mRECIST', 'Best Average Response', 'Slope', 'AUC', 'Survival (Days)'],
            });
        }
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
                newData[total].link = eachdata.link;
                newData[total].row = eachdata.row;
                total += 1;
            }
            newData[total - 1][eachdata.response_type === 'best.average.response' ? 'bar' : eachdata.response_type] = eachdata.value;
        });

        // creating each table row.
        const createTableRow = (eachdata, index) => {
            const {
                patient, model, drug,
                bar, mRECIST, slope, AUC,
                survival, link, row,
            } = eachdata;

            // will not return anything if there is no data.
            const checkData = (val) => {
                let tableData = '';
                if (val && val === link) {
                    tableData = <td style={{ minWidth: 150 }}><a href={val} target="_blank" rel="noopener noreferrer">Google-Sheet</a></td>;
                } else if (val && val === row) {
                    tableData = <td>{val}</td>;
                } else {
                    tableData = null;
                }
                return tableData;
            };

            const dataRow = (
                <tr key={index} className={`responsetable_${model.replace(/\./g, '_')}`}>
                    <td>{patient}</td>
                    <td>{model}</td>
                    <td>{drug}</td>
                    <td>{mRECIST}</td>
                    <td>{bar}</td>
                    <td>{slope}</td>
                    <td>{AUC}</td>
                    <td>{survival}</td>
                    {checkData(link)}
                    {checkData(row)}
                </tr>
            );

            return dataRow;
        };

        // create the table.
        const table = newData.map((eachdata, index) => (
            createTableRow(eachdata, index)
        ));

        return table;
    }

    createTableHeader() {
        // create the header for the table.
        const { tableHeader } = this.state;
        const header = tableHeader.map((key, index) => <th key={index}>{key}</th>);
        return header;
    }

    render() {
        const { batchData } = this.state;
        return (
            <>
                <BatchStatTable data={batchData} />
                <div className="curve-wrapper" style={{ marginTop: '0px', padding: '30px 0px' }}>
                    <h1 id="titlemodel">Statistics (Model Response)</h1>
                    <StyleTable>
                        <table id="stats-table">
                            <tbody>
                                <tr>{this.createTableHeader()}</tr>
                                {this.createTable()}
                            </tbody>
                        </table>
                    </StyleTable>
                </div>
            </>
        );
    }
}


export default StatTable;
