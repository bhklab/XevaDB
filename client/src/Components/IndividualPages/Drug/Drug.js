import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalStyles from '../../../GlobalStyles';
import Spinner from '../../Utils/Spinner';
import Footer from '../../Footer/Footer';
import Annotation from './Annotation';
import PatientResponseScatterPlot from './PatientResponseScatterPlot';
import PatientResponsePieChart from './PatientResponsePieChart';

// h4 style
const h4Style = {
    margin: '10px 0px 125px 0px',
    color: 'black',
    fontWeight: 200,
};

// Individual drug page component
const Drug = (props) => {
    // get the drug id from the props object 
    // and assign it to drugId variable
    const { match: { params: { id: drugId } } } = props;

    // state to save the drug information data and setting loader state
    const [drugData, setDrugData] = useState([]);
    const [modelResponseDataPerDrug, setModelResponseDataPerDrug] = useState([]);
    const [modelResponseData, setModelResponseData] = useState([]);
    const [isLoading, setLoadingState] = useState(true);

    // query to fetch the drug information data
    const fetchData = async () => {
        // get the drug information based on the drugId
        const drugInformation = await axios.get(
            `/api/v1/drugs/${drugId}`,
            { headers: { Authorization: localStorage.getItem('user') } }
        );
        const modelResponseBasedOnDrug = await axios.get(
            `/api/v1/modelresponse?drug=${drugInformation.data[0].drug_name.replace(/\s/g, '').replace(/\+/g, '_')}`,
            { headers: { Authorization: localStorage.getItem('user') } }
        );
        const modelResponse = await axios.get(
            `/api/v1/modelresponse`,
            { headers: { Authorization: localStorage.getItem('user') } }
        );

        const { data: drugData } = drugInformation;
        const { data: modelDataPerDrug } = modelResponseBasedOnDrug;
        const { data: modelData } = modelResponse;

        // set drug and model response data
        setDrugData(drugData[0]);
        setModelResponseDataPerDrug(modelDataPerDrug);
        setModelResponseData(modelData);

        // set loader state
        setLoadingState(false);
    };

    // useEffect hook
    useEffect(() => {
        // fetch the data
        fetchData();
    }, []);

    return (
        <>
            <GlobalStyles />
            <div className='wrapper'>
                {
                    isLoading
                        ? <Spinner loading={isLoading} />
                        : (
                            <div className='component-wrapper center-component'>
                                <h1> {drugData.drug_name} </h1>
                                <Annotation
                                    data={drugData}
                                />
                                <h1> Model Response </h1>
                                <div>
                                    <div style={{ position: 'absolute' }}>
                                        <PatientResponsePieChart
                                            data={modelResponseDataPerDrug}
                                            chartId='model-response-per-drug'
                                            arcRadius={{ outerRadius: 160, innerRadius: 100 }}
                                            shouldDisplayLegend={false}
                                        />
                                    </div>
                                    <div>
                                        <PatientResponsePieChart
                                            data={modelResponseData}
                                            chartId='model-response-all-drugs'
                                            arcRadius={{ outerRadius: 300, innerRadius: 200 }}
                                            shouldDisplayLegend={true}
                                        />
                                    </div>
                                </div>
                                <PatientResponseScatterPlot
                                    data={modelResponseDataPerDrug[0]}
                                />
                                <h4 style={h4Style}> Patient </h4>
                            </div>
                        )
                }
            </div>
            <Footer />
        </>
    )
};

export default Drug;
