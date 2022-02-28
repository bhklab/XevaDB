import React, { useState, useEffect } from 'react';
import axios from 'axios';

// header constant
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };

// Patient Response Chart component 
const PatientResponseChart = () => {
    // model response data
    const [modelResponseData, setModelResponseData] = useState([]);

    // use effect react hook
    useEffect(() => {
        // fetch data function
        fetchData();
    });

    // fetch model response data
    const fetchData = async () => {
        const modelResponse = await axios.get(`/api/v1/modelresponse?drug=BGJ398`, HEADER);
        console.log(modelResponse);
    };

    return (
        <h1> Patient Response </h1>
    )
};


export default PatientResponseChart;
