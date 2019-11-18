import React from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import TableWrapper from '../Drug/DrugTableStyle';

const h1Style = {
    color: '#3453b0',
    margin: '50px',
};

class DatasetTable extends React.Component {
    constructor(props) {
        super(props);
        // setting the states for the data.
        this.state = {
            data: [],
        };
    }

    componentWillMount() {
        axios.get('/api/v1/datasets')
            .then((response) => {
                this.setState({
                    data: response.data.data,
                });
            });
    }

    render() {
        const { data } = this.state;

        const columns = [
            {
                Header: 'ID',
                accessor: 'dataset_id',
                minWidth: 180,
                sortable: true,
            },
            {
                Header: 'Dataset Name',
                accessor: 'dataset_name',
                minWidth: 150,
            },
        ];

        return (
            <div>
                <h1 style={h1Style}> Datasets </h1>
                <TableWrapper className="wrap">
                    <ReactTable
                        data={data}
                        columns={columns}
                        className="-highlight"
                        defaultPageSize={10}
                        filterable
                    />
                </TableWrapper>
            </div>
        );
    }
}

export default DatasetTable;
