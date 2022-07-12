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
    return transformedData;
};

// transform data for BarPlot.
const barPlotData = (data) => {
    return data.map((element) => (
        {
            id: element.name,
            value: element.patients.length,
        }
    ));
};

// patient Summary Component
const PatientSummary = () => {
    const [patientData, setPatientDataState] = useState([]);
    const [datasetsDetailedInformation, setDatasetDetailedInformation] = useState([]);
    const [loading, setLoader] = useState(true);

    const fetchData = async () => {
        // api request to get the required data.
        const models = await axios.get('/api/v1/modelinformation', { headers: { Authorization: localStorage.getItem('user') } });
        // api request to get dataset detailed information.
        const datasetsDetail = await axios.get('/api/v1/datasets/detail', { headers: { Authorization: localStorage.getItem('user') } });
        // transforming data.
        setPatientDataState(Object.values(transformData(models.data.data)));
        setDatasetDetailedInformation(datasetsDetail.data.datasets);
        setLoader(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <GlobalStyles />
            <div className='wrapper'>
                <div className='component-wrapper center-component'>
                    {/* <h1> Number of Patients per Dataset </h1> */}
                    {
                        loading
                            ? <Spinner loading={loading} />
                            : (
                                <BarPlot
                                    data={barPlotData(datasetsDetailedInformation)}
                                    shouldAppendBarText={true}
                                    yLabel='Number of patients'
                                    xLabel='Dataset'
                                    dimensions={{ width: 700, height: 400 }}
                                />
                            )
                    }
                </div>
                <div className='component-wrapper'>
                    <h1> List of Patients </h1>
                    {
                        loading
                            ? (
                                <div className='center-component'>
                                    <Spinner loading={loading} />
                                </div>
                            )
                            : <PatientTable patientData={patientData} />
                    }
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PatientSummary;
