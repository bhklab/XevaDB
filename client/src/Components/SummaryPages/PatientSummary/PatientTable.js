import React from 'react';
import ReactTable from 'react-table';
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
        },
        {
            Header: 'Patient',
            accessor: 'patient',
            minWidth: 160,
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
