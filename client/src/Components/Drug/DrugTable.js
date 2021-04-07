import React from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import TableWrapper from './DrugTableStyle';
import pubchem from '../../images/pclogo_220.gif';
import Spinner from '../Utils/Spinner';
import 'react-table/react-table.css';
import colors from '../../styles/colors';

const h1Style = {
    color: `${colors.blue_header}`,
    margin: '50px',
};

// base link for pubchem.
const pubchemURL = 'https://pubchem.ncbi.nlm.nih.gov/compound/';

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
        data.forEach((val) => {
            val.img = pubchem;
        });

        // to capitalize first alphabet.
        const capitalize = (s) => {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        };

        const columns = [
            {
                Header: 'Drug Name',
                accessor: 'drug_name',
                minWidth: 180,
                Cell: (props) => capitalize(props.value),
                sortable: true,
            },
            {
                Header: 'Standard Name',
                accessor: 'standard_name',
                minWidth: 150,
                Cell: (props) => capitalize(props.value),
                sortable: true,
            },
            {
                Header: 'Targets',
                accessor: 'class',
                minWidth: 150,
                Cell: (props) => capitalize(props.value),
                sortable: true,
            },
            {
                Header: 'Class',
                accessor: 'class_name',
                minWidth: 220,
                Cell: (props) => capitalize(props.value),
                sortable: true,
            },
            {
                Header: 'PubChem CID',
                Cell: (val) => {
                    const pubchemLink = (val.original.pubchemid.split(','));
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
                                        className="hover"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`${pubchemURL}${row}`}
                                        style={{ textDecoration: 'none', color: `${colors.blue_header}` }}
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
            loading
                ? (<Spinner loading={loading} />)
                : (
                    <TableWrapper className="wrap">
                        <h1 style={h1Style}> List of Drugs </h1>
                        <ReactTable
                            data={data}
                            columns={columns}
                            className="-highlight"
                            defaultPageSize={10}
                            filterable
                        />
                    </TableWrapper>
                )
        );
    }
}

export default DrugTable;
