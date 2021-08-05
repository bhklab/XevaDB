import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import TableWrapper from '../../Utils/TableStyle';
import 'react-table/react-table.css';
import colors from '../../../styles/colors';

const h1Style = {
    color: `${colors.blue_header}`,
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
            sortable: false,
            Cell: (row) => (
                <Link to={`/dataset/${row.original.dataset_id}`} style={{ color: `${colors.blue_header}`, textDecoration: 'none' }}>
                    {row.original.dataset_name}
                </Link>
            ),
        },
        {
            Header: 'Patients',
            accessor: 'totalPatients',
            minWidth: 120,
        },
        {
            Header: 'Models',
            accessor: 'totalModels',
            minWidth: 120,
        },
    ];

    return (
        <TableWrapper>
            <h1 style={h1Style}> List of Datasets </h1>
            <ReactTable
                data={data}
                columns={columns}
                className="-highlight"
                showPagination={false}
                pageSize={dataLength > 0 ? dataLength + 1 : 7}
            />
        </TableWrapper>
    );
};

DatasetTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataLength: PropTypes.number.isRequired,
};

export default DatasetTable;
