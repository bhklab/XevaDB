import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import TableWrapper from '../../Utils/TableStyle';
import 'react-table/react-table.css';
import colors from '../../../styles/colors';

const TissueTable = ({ data }) => {
    const columns = [
        {
            Header: 'Tissue',
            accessor: 'tissue',
            minWidth: 160,
            Cell: (row) => (
                <Link to={`/tissue/${row.original.tissue_id}`}>
                    {row.original.tissue}
                </Link>
            ),
        },
        {
            Header: 'Datasets',
            accessor: 'dataset_count',
            minWidth: 160,
        },
        {
            Header: 'Patients',
            accessor: 'patient_count',
            minWidth: 160,
        },
        {
            Header: 'Models',
            accessor: 'model_count',
            minWidth: 160,
        },
        {
            Header: 'Drugs',
            accessor: 'drug_count',
            minWidth: 160,
        },
    ];

    return (
        <TableWrapper>
            <ReactTable
                data={data}
                columns={columns}
                className="-highlight"
                showPagination={false}
                defaultPageSize={data.length + 1}
            />
        </TableWrapper>
    );
};

export default TissueTable;
