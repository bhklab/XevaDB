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
                <Link to={`/tissue/${row.original.tissue_id}`} style={{ color: `${colors.blue_header}`, textDecoration: 'none' }}>
                    {row.original.tissue}
                </Link>
            ),
        },
        {
            Header: 'No. of Patients',
            accessor: 'patient_count',
            minWidth: 160,
        },
        {
            Header: 'No. of Models',
            accessor: 'model_count',
            minWidth: 160,
        },
        {
            Header: 'No. of Drugs',
            accessor: 'drug_count',
            minWidth: 160,
        },
    ];

    return (
        <TableWrapper>
            <h1> List of Patients </h1>
            <ReactTable
                data={data}
                columns={columns}
                className="-highlight"
                defaultPageSize={7}
                filterable
            />
        </TableWrapper>
    );
};

export default TissueTable;
