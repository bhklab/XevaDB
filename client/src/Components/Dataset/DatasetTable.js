import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import TableWrapper from '../Drug/DrugTableStyle';

const h1Style = {
    color: '#3453b0',
    margin: '50px',
};

const DatasetTable = (props) => {
    const { data } = props;
    console.log(data);
    const columns = [
        {
            Header: 'Dataset Name',
            accessor: 'id',
            minWidth: 180,
        },
        {
            Header: 'Patients',
            accessor: 'value',
            minWidth: 120,
        },
        {
            Header: 'Models',
            accessor: 'totalModels',
            minWidth: 120,
        },
    ];

    return (
        <div>
            <h1 style={h1Style}> Datasets </h1>
            <TableWrapper className="wrap">
                <ReactTable
                    data={data}
                    columns={columns}
                    className="datasetTable"
                    defaultPageSize={10}
                    filterable
                />
            </TableWrapper>
        </div>
    );
};

export default DatasetTable;
