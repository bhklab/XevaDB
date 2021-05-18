import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import Spinner from '../../Utils/Spinner';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';
import PatientTable from './PatientTable';
import TreeDiagram from '../../Plots/TreeDiagram';

// header constant.
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };

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

// transforming the patient data for the tree diagram.
const transformTreeDiagramData = (data) => {
    // transforming data.
    let transformedData = '';
    // making hirerichal data.
    data.forEach((element, i) => {
        if (i === 0) {
            transformedData = {
                name: element.name,
                dataset: element.dataset.name,
                children: [
                    {
                        name: element.drug.name,
                        children: [{ name: element.model.name }],
                    },
                ],
            };
        } else {
            transformedData.children.push(
                {
                    name: element.drug.name,
                    children: [{ name: element.model.name }],
                },
            );
        }
    });
    return transformedData;
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
                            <TreeDiagram data={transformTreeDiagramData(patientData)} />
                            <div className="summary-table">
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
