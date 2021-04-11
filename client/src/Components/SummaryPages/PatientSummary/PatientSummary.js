import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../Utils/Spinner';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';
import PatientTable from './PatientTable';

const PatientSummary = () => {
    const [patientData, setPatientDataState] = useState([]);
    const [loading, setLoader] = useState(true);

    useEffect(() => {
        axios.get('/api/v1/patients', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const { data } = response.data;
                setPatientDataState(data);
                setLoader(false);
            });
    }, []);

    return (
        <>
            <GlobalStyles />
            <div className="wrapper">
                <div className="donut-wrapper summary-table">
                    {
                        loading ? (<Spinner loading={loading} />)
                            : (<PatientTable data={patientData} />)
                    }
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PatientSummary;
