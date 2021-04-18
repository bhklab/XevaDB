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
        const transformedData = {};

        data.forEach((row) => {
            const patient = transformedData[row.patient];
            const model = transformedData[row.model];
            const drug = transformedData[row.drug_name];

            if (patient && !patient.models.includes(model)) {
                transformedData[row.patient].model_count += 1;
            }
            if (patient && !patient.drugs.includes(drug)) {
                transformedData[row.patient].drug_count += 1;
            } else {
                transformedData[row.patient] = {
                    dataset_id: row.dataset_id,
                    dataset: row.dataset_name,
                    patient: row.patient,
                    model_count: 1,
                    drug_count: 1,
                    models: [row.model],
                    drugs: [row.drug_name],
                };
            }
        });
        return transformedData;
    };

    const fetchData = async () => {
        // api request to get the required data.
        const models = await axios.get('/api/v1/modelinformation', { headers: { Authorization: localStorage.getItem('user') } });
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
                <div className="summary-table" style={{ marginTop: '4vh' }}>
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
