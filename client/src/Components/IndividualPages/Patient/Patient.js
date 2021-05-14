import React, { useEffect, useState } from 'react';
import axios from 'axios';
import colors from '../../../styles/colors';
import Spinner from '../../Utils/Spinner';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';
import PatientTable from './PatientTable';
import TreeDiagram from '../../Plots/TreeDiagram';

// header constant.
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };

/**
 * @param {Object} props - prop object.
 * patient component.
*/
const Patient = (props) => {
    // getting patient parameter from the props object.
    const { match } = props;
    const patientParam = match.params.id;

    // patient and loader state.
    const [patientData, setPatientDataState] = useState({});
    const [loading, setLoader] = useState(true);

    // transforming the patient data.
    const transformData = (data) => {
        const { dataset, tissue, drugs } = data;
        const patientId = data.id;
        const patientName = data.name;
        const finalData = [];

        data.models.forEach((row, i) => {
            finalData.push({
                id: patientId,
                name: patientName,
                dataset,
                tissue,
                model: row,
                drug: drugs[i],
            });
        });
        return finalData;
    };

    // query to fetch the patient detail based on the patient parameter.
    const fetchData = async () => {
        // API call to fecth the data.
        const patientDetail = await axios.get(`/api/v1/patients/details/${patientParam}`, HEADER);
        // setting the states.
        setPatientDataState(transformData(patientDetail.data.data[0]));
        setLoader(false);
    };

    useEffect(() => {
        // fetching the data.
        fetchData();
    }, []);

    return (
        <>
            <GlobalStyles />
            <div className="wrapper">
                {
                    loading ? <Spinner loading={loading} /> : (
                        <>
                            <h1>
                                Patient =
                                {' '}
                                <span style={{ color: `${colors.pink_header}` }}>
                                    {patientData[0].name}
                                </span>
                            </h1>
                            <div className="summary-table">
                                <PatientTable patientData={patientData} />
                            </div>
                            <TreeDiagram />
                        </>
                    )
                }
                <Footer />
            </div>
            <Footer />
        </>
    );
};

export default Patient;
