import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNav from '../../TopNav/TopNav';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';
import PatientTable from './PatientTable';

const PatientSummary = () => {
    const [patientData, setPatientDataState] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/patients', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const { data } = response.data;
                setPatientDataState(data);
            });
    }, []);

    return (
        <>
            <TopNav />
            <GlobalStyles />
            <div className="wrapper">
                <div className="donut-wrapper summary-table">
                    <PatientTable data={patientData} />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default PatientSummary;
