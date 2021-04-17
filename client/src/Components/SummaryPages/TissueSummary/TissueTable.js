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
        },
        {
            Header: 'Patient',
            accessor: 'patient',
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
                defaultPageSize={10}
                filterable
            />
        </TableWrapper>
    );
};

export default TissueTable;
