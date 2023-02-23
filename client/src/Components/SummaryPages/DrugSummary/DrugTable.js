import React from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import TableWrapper from '../../Utils/TableStyle';
import Spinner from '../../Utils/Spinner';
import 'react-table/react-table.css';
import firstAlphabetUpperCase from '../../../utils/FirstAlphabetUpperCase';
import pubchemURL from '../../../utils/PubChemURL';
import TableFiltering from '../../Utils/TableFiltering';

class DrugTable extends React.Component {
    constructor(props) {
        super(props);
        // setting the states for the data.
        this.state = {
            data: [],
            loading: true,
        };
    }

    componentDidMount() {
        axios.get('/api/v1/drugs', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                this.setState({
                    data: response.data,
                    loading: false,
                });
            });
    }

    render() {
        const { data, loading } = this.state;

        // adding image to each of the object in array.
        // data.forEach((val) => {
        //     val.img = pubchem;
        // });

        const columns = [
            {
                Header: 'Drug Name',
                accessor: 'drug_name',
                minWidth: 180,
                Cell: (row) => (
                    <Link to={`/drug/${row.original.drug_id}`}>
                        {row.original.drug_name}
                    </Link>
                ),
                sortable: true,
            },
            {
                Header: 'Standard Name',
                accessor: 'standard_name',
                minWidth: 150,
                Cell: (props) => firstAlphabetUpperCase(props.value),
                sortable: true,
            },
            {
                Header: 'Targets',
                accessor: 'class',
                minWidth: 150,
                Cell: (props) => firstAlphabetUpperCase(props.value),
                sortable: true,
            },
            {
                Header: 'Class',
                accessor: 'class_name',
                minWidth: 220,
                Cell: (props) => firstAlphabetUpperCase(props.value),
                sortable: true,
            },
            {
                Header: 'PubChem CID',
                Cell: (val) => {
                    const pubchemLink = String(val.original.pubchemid).split(',');
                    const { length } = pubchemLink;
                    const link = [];
                    let isNa = '';

                    // function checks if any of the value in the pubchemlink array is NA.
                    pubchemLink.forEach((row) => {
                        if (row === 'NA' || row === '') {
                            isNa = true;
                        }
                    });

                    // looping through the pubchemLink and adding image and url based on the data.
                    pubchemLink.forEach((row, i) => {
                        const pid = Number(row.split('/').pop());
                        if (pid) {
                            link.push(
                                <span key={row}>
                                    <a
                                        className='hover'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href={`${pubchemURL}${row}`}
                                    >
                                        {pid}
                                    </a>
                                    {((length > i + 1) && !isNa) ? <span>, </span> : ''}
                                </span>,
                            );
                        }
                    });
                    return link;
                },
                sortable: true,
            },
        ];

        return (
            <TableWrapper>
                {
                    loading ? (
                        <div className='center-component'>
                            <Spinner loading={loading} />
                        </div>
                    ) : (
                        <ReactTable
                            data={data}
                            columns={columns}
                            className='-highlight'
                            defaultPageSize={10}
                            filterable
                            defaultFilterMethod={TableFiltering}
                        />
                    )
                }
            </TableWrapper>
        );
    }
}

export default DrugTable;
