import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../Utils/Spinner';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';
import PatientTable from './PatientTable';
import TreeDiagram from '../../Plots/TreeDiagram';
import colors from '../../../styles/colors';

// header constant.
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };

// transforming the patient data.
const transformData = (data) => {
    const { dataset, tissue } = data;
    const patientId = data.id;
    const patientName = data.name;
    const finalData = [];

    data.models.forEach((row) => {
        finalData.push({
            id: patientId,
            name: patientName,
            dataset,
            tissue,
            model: { id: row.id, name: row.name },
            drug: row.drug,
        });
    });
    return finalData;
};

// transforming the patient data for the tree diagram.
const transformTreeDiagramData = (data) => {
    // transforming data.
    let transformedData = '';
    // making hirerichal data.
    data.forEach((element, i) => {
        const drug = Object(element.drug) ? element.drug.name : '';
        const dataset = element.dataset.name;
        const model = element.model.name;

        if (i === 0) {
            transformedData = {
                name: element.name,
                dataset,
                children: {
                    [`${drug}`]: {
                        name: drug,
                        children: [{ name: model }],
                    },
                },
            };
        } else if (drug in transformedData.children) {
            transformedData.children[drug].children.push({
                name: model,
            });
        } else {
            transformedData.children[drug] = {
                name: drug,
                children: [{ name: model }],
            };
        }
    });

    return ({
        ...transformedData,
        children: Object.values({ ...transformedData.children }),
    });
};

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

    // query to fetch the patient detail based on the patient parameter.
    const fetchData = async () => {
        // API call to fecth the data.
        const patientDetail = await axios.get(`/api/v1/patients/detail/${patientParam}`, HEADER);
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
                            <div className='component-wrapper center-component'>
                                <h1 style={{ fontSize: '1.45em', fontWeight: '500' }}>
                                    Dataset:
                                    {' '}
                                    <span style={{ color: `${colors['--bg-color']}`, fontWeight: '600', fontSize: '0.85em' }}>
                                        {patientData[0].dataset.name}
                                    </span>
                                    {' '}
                                    and
                                    Patient:
                                    {' '}
                                    <span style={{ color: `${colors['--bg-color']}`, fontWeight: '600', fontSize: '0.85em' }}>
                                        {patientData[0].name}
                                    </span>
                                </h1>
                                <TreeDiagram data={transformTreeDiagramData(patientData)} />
                            </div>
                            <div className='component-wrapper'>
                                <h1> List of Models </h1>
                                <PatientTable patientData={patientData} />
                            </div>
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
