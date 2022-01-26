import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../Footer/Footer';
import GlobalStyles from '../../GlobalStyles';
import Spinner from '../Utils/Spinner';

// header constant.
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };

const Drug = (props) => {
    // get the drug id from the props object 
    // and assign it to drugId variable
    const { match: { params: { id: drugId } } } = props;

    // state to save the drug information data and setting loader state
    const [drugData, setDrugData] = useState({});
    const [isLoading, setLoadingState] = useState(true);


    // query to fetch the drug information data
    const fetchData = async () => {
        // get the drug information based on the drugId
        const drugInformation = await axios.get(`/api/v1/drugs/${drugId}`, HEADER);
        console.log(drugInformation);

        // update the state of data
        const { data } = drugInformation;
        setDrugData(data[0]);

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
                            <h1> {drugData.drug_name} </h1>
                        )
                }
            </div>
            <Footer />
        </>
    )
};

export default Drug;
