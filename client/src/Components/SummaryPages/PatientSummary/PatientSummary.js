import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../Utils/Spinner';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';
import PatientTable from './PatientTable';
import BarPlot from '../../Plots/BarPlot';

// transform the data for the patient table.
const transformData = (data) => {
    const transformedData = {};

    data.forEach((row) => {
        const patient = transformedData[row.patient];

        if (patient && !patient.models.includes(row.model)) {
            transformedData[row.patient].model_count += 1;
            patient.models.push(row.model);
        }
        if (patient && !patient.drugs.includes(row.drug)) {
            transformedData[row.patient].drug_count += 1;
            patient.drugs.push(row.drug_name);
        } else {
            transformedData[row.patient] = {
                dataset_id: row.dataset_id,
                dataset: row.dataset_name,
                patient: row.patient,
                patient_id: row.patient_id,
                model_count: 1,
                drug_count: 1,
                models: [row.model],
                drugs: [row.drug_name],
            };
        }
    });
    console.log(transformedData);
    return transformedData;
};

// transform data for BarPlot.
const barPlotData = (data) => {
    const barData = data.map((element) => (
        {
            id: element.patient,
            value: element.drugs.length,
        }
    ));
    return barData;
};

// patient Summary Component
const PatientSummary = () => {
    const [patientData, setPatientDataState] = useState([]);
    const [loading, setLoader] = useState(true);

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
                <div className="donut-wrapper">
                    <h1> Number of Drugs Tested on a Patient </h1>
                    {
                        loading ? <Spinner loading={loading} />
                            : (
                                <BarPlot
                                    data={barPlotData(patientData.slice(1, 50))}
                                />
                            )
                    }
                </div>
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
