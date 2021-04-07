import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import TableWrapper from '../../Utils/TableStyle';
import Spinner from '../../Utils/Spinner';
import 'react-table/react-table.css';
import colors from '../../../styles/colors';

const PatientTable = (props) => {
    const { data } = props;

    const columns = [
        {
            Header: 'Patient ID',
            accessor: 'patient_id',
            minWidth: 160,
            Cell: (row) => (
                <Link to={`/patient/${row.original.patient_id}`} style={{ color: `${colors.blue_header}`, textDecoration: 'none' }}>
                    {row.original.patient_id}
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
    ];

    return (
        <TableWrapper className="wrap">
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

export default PatientTable;
