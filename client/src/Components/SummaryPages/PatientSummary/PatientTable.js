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
            Header: 'Dataset',
            accessor: 'dataset',
            minWidth: 160,
            Cell: (row) => (
                <Link to={`/dataset/${row.original.dataset_id}`} style={{ color: `${colors.blue_header}`, textDecoration: 'none' }}>
                    {row.original.dataset}
                </Link>
            ),
        },
        {
            Header: 'Patient',
            accessor: 'patient',
            minWidth: 160,
            Cell: (row) => (
                <Link to={`/patient/${row.original.patient_id}`} style={{ color: `${colors.blue_header}`, textDecoration: 'none' }}>
                    {row.original.patient}
                </Link>
            ),
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
                data={patientData}
                columns={columns}
                className="-highlight"
                defaultPageSize={10}
                defaultSorted={[{ id: 'dataset' }]}
                filterable
            />
        </TableWrapper>
    );
};

export default PatientTable;
