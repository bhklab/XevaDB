import React from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import TableWrapper from './DrugTableStyle';
import pubchem from '../../images/pclogo_220.gif';
import Spinner from '../SpinnerUtil/Spinner';
import 'react-table/react-table.css';

const h1Style = {
    color: '#3453b0',
    margin: '50px',
};

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
        axios.get('/api/v1/drugs')
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
                Header: 'Targets',
                accessor: 'class',
                minWidth: 150,
                Cell: (props) => capitalize(props.value),
                sortable: true,
            },
            {
                Header: 'Class',
                accessor: 'class_name',
                minWidth: 230,
                Cell: (props) => capitalize(props.value),
                sortable: true,
            },
            {
                Header: 'Source',
                Cell: (val) => (
                    <div>
                        <img height={38} src={val.original.img} alt="pubchem links" />
                    </div>
                ),
                sortable: false,
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
