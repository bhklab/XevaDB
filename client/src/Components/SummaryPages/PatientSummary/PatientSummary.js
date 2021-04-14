import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../Utils/Spinner';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';
import PatientTable from './PatientTable';

const PatientSummary = () => {
    const [patientData, setPatientDataState] = useState([]);
    const [loading, setLoader] = useState(true);

    const transformData = (data) => {
        const transformedData = [];

        data.forEach((row) => {
            if (row.patient in transformedData) {
                transformedData[row.patient].count += 1;
            } else {
                transformedData[row.patient] = {
                    patient_id: row.patient_id,
                    patient: row.patient,
                    count: 1,
                };
            }
        });

        return transformedData;
    };

    const fetchData = async () => {
        // api request to get the required data.
        const models = await axios.get('/api/v1/models', { headers: { Authorization: localStorage.getItem('user') } });

        // transforming data.
        setPatientDataState(Object.values(transformData(models.data.data)));
        setLoader(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <GlobalStyles />
            <div className="wrapper">
                <div className="donut-wrapper summary-table">
                    {
                        loading ? (<Spinner loading={loading} />)
                            : (<PatientTable patientData={patientData} />)
                    }
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PatientSummary;
