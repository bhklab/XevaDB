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
    const transformedData = data.map((element) => (
        {
            name: element.model.name,
            parent: element.name,
        }
    ));
    // pushing patient id.
    transformedData.push({ name: data[0].name, parent: '' });

    // d3 function to create the root of the tree (data).
    const root = d3.stratify()
        .id((d) => d.name)
        .parentId((d) => d.parent)(transformedData);

    return root;
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
