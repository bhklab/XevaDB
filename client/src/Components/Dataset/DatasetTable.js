import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import TableWrapper from '../Drug/DrugTableStyle';

const h1Style = {
    color: '#3453b0',
    margin: '50px',
};

const DatasetTable = (props) => {
    const { data, dataLength } = props;

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

        <div>
            <h1 style={h1Style}> List of Datasets </h1>
            <TableWrapper className="wrap">
                <ReactTable
                    data={data}
                    columns={columns}
                    className="datasetTable"
                    showPagination={false}
                    pageSize={dataLength > 0 ? dataLength + 1 : 7}
                />
            </TableWrapper>
        </div>
    );
};

export default DatasetTable;
