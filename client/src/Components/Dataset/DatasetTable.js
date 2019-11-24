import React from 'react';
import ReactTable from 'react-table';
import TableWrapper from '../Drug/DrugTableStyle';
import Spinner from '../SpinnerUtil/Spinner';
import 'react-table/react-table.css';

const h1Style = {
    color: '#3453b0',
    margin: '50px',
};

const DatasetTable = (props) => {
    const { data, dataLength } = props;
    const loading = !(dataLength > 0);

    const columns = [
        {
            Header: 'Dataset Name',
            accessor: 'id',
            minWidth: 180,
            search: false,
        },
        {
            Header: 'Number of Patients',
            accessor: 'value',
            minWidth: 120,
        },
        {
            Header: 'Number of Models',
            accessor: 'totalModels',
            minWidth: 120,
        },
    ];

    return (
        loading ? (<Spinner loading={loading} />)
            : (
                <TableWrapper className="wrap">
                    <h1 style={h1Style}> List of Datasets </h1>
                    <ReactTable
                        data={data}
                        columns={columns}
                        className="-highlight"
                        showPagination={false}
                        pageSize={dataLength > 0 ? dataLength + 1 : 7}
                    />
                </TableWrapper>
            )
    );
};

export default DatasetTable;
