/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable class-methods-use-this */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { CSVLink } from 'react-csv';
import { StyleTable, StyledLink } from './ResponseStyle';
import BatchStatTable from './BatchResponseStatTable';
import downloadIcon from '../../images/download.svg';
import colors from '../../styles/colors';

class StatTable extends React.Component {
    constructor(props) {
        super(props);
        // data for the table.
        this.state = {
            data: [],
            batchData: [],
            tableHeader: ['Type', 'Model', 'Drug',
                'mRECIST', 'Best Average Response', 'Slope', 'AUC',
                'Survival (Days)'],
        };
        this.createTable = this.createTable.bind(this);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.parseData = this.parseData.bind(this);
        this.getCSVHeader = this.getCSVHeader.bind(this);
    }

    componentDidMount() {
        const { drugParam, patientParam } = this.props;
        const getModelResponse = axios.get(`/api/v1/modelresponse/stats?patient=${patientParam}&drug=${drugParam}`, { headers: { Authorization: localStorage.getItem('user') } });
        const getBatchResponse = axios.get(`/api/v1/batchresponse/stats?patient=${patientParam}&drug=${drugParam}`, { headers: { Authorization: localStorage.getItem('user') } });

        Promise.all([getBatchResponse, getModelResponse]).then((response) => {
            this.parseData(response);
        });
    }

    getCSVHeader(data) {
        let headers = [];
        if (data.length !== 0) {
            headers = Object.keys(data[0]).map((value) => ({
                label: value.split('_').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
                key: value,
            }));
        }
        return headers;
    }

    parseData(response) {
        this.setState({
            data: response[1].data,
            batchData: response[0].data,
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
                newData[total].link = eachdata.link;
                newData[total].row = eachdata.row;
                newData[total].type = drugValue.match(/(^untreated$|^water$|^control$|^h2o$)/i) ? 'Control' : 'Treatment';
                total += 1;
            }
            newData[total - 1][eachdata.response_type === 'best.average.response' ? 'bar' : eachdata.response_type] = eachdata.value;
        });

        // sorting data based on control and treatment.
        const finalData = [];
        newData.forEach((el) => {
            if (el.type === 'Treatment') {
                finalData.unshift(el);
            } else {
                finalData.push(el);
            }
        });

        // creating each table row.
        const createTableRow = (eachdata, index) => {
            const {
                model, drug, type,
                bar, mRECIST, slope,
                AUC, survival, link,
            } = eachdata;

            const dataRow = (
                // style={{ backgroundColor: `${drug.match(/(^untreated$|^water$|^control$|^h2o$)/i) ? `${colors.white_red}` : `${colors.fade_blue}`}` }}
                <tr key={index} className={`responsetable_${model.replace(/\./g, '_')}`}>
                    <td>{type}</td>
                    {
                        link
                            ? (
                                <Tippy
                                    content={<a style={{ color: `${colors.lightgray}` }} href={link} target="_blank" rel="noopener noreferrer">Link to the raw data</a>}
                                    interactive
                                    interactiveBorder={20}
                                    placement="right"
                                >
                                    <td>
                                        {model}
                                    </td>
                                </Tippy>
                            )
                            : (
                                <td>
                                    {model}
                                </td>
                            )
                    }

                    <td>{drug}</td>
                    <td>{mRECIST}</td>
                    <td>{bar}</td>
                    <td>{slope}</td>
                    <td>{AUC}</td>
                    <td>{parseInt(survival, 10)}</td>
                </tr>
            );

            return dataRow;
        };

        // create the table.
        const table = finalData.map((eachdata, index) => (
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
        const { batchData, data } = this.state;
        // const datasetId = data[0] && data[0].dataset_id;
        const csvHeader = this.getCSVHeader(data);
        const tableHeader = this.createTableHeader();
        const table = this.createTable();

        return (
            <>
                <BatchStatTable data={batchData} />
                <div>
                    <StyledLink>
                        <h1>Model Response</h1>
                        <CSVLink data={data} headers={csvHeader} filename="modelresponse.csv">
                            Export Data
                            <img src={downloadIcon} alt="download icon!" />
                        </CSVLink>
                    </StyledLink>
                    <StyleTable>
                        <table>
                            <tbody>
                                <tr>{tableHeader}</tr>
                                {table}
                            </tbody>
                        </table>
                    </StyleTable>
                </div>
            </>
        );
    }
}

StatTable.propTypes = {
    patientParam: PropTypes.string.isRequired,
    drugParam: PropTypes.string.isRequired,
};

export default StatTable;
