/* eslint-disable no-shadow */
import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import TableWrapper from '../../Utils/TableStyle';
import 'react-table/react-table.css';
import colors from '../../../styles/colors';

const PatientTable = (props) => {
    const { patientData } = props;

    const columns = [
        {
            Header: 'Model',
            accessor: 'model',
            minWidth: 160,
            Cell: ({ row }) => (
                <span>
                    {`${row.model.name}`}
                </span>
            ),
        },
        {
            Header: 'Drug',
            accessor: 'drug',
            minWidth: 160,
            Cell: ({ row }) => (
                <span>
                    {`${row.drug.name}`}
                </span>
            ),
        },
        {
            Header: 'Dataset',
            accessor: 'dataset',
            minWidth: 160,
            Cell: ({ row }) => (
                <Link to={`/dataset/${row.dataset.id}`}>
                    {row.dataset.name}
                </Link>
            ),
        },
        {
            Header: 'Tissue',
            accessor: 'tissue',
            minWidth: 160,
            Cell: ({ row }) => (
                <Link to={`/tissue/${row.tissue.id}`}>
                    {row.tissue.name}
                </Link>
            ),
        },
    ];

    return (
        <TableWrapper>
            <ReactTable
                data={patientData}
                columns={columns}
                className="-highlight"
                defaultPageSize={patientData.length + 1}
                filterable
            />
        </TableWrapper>
    );
};

export default PatientTable;
