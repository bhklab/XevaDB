import React, { useEffect, useState } from 'react';
import axios from 'axios';
import colors from '../../styles/colors';
import Spinner from '../Utils/Spinner';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';

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
    const [patientData, setPatientDataState] = useState([]);
    const [loading, setLoader] = useState(true);

    const fetchData = async () => {
        // API call to fecth the data.
        const patientDetail = await axios.get(`/api/v1/patients/details/${patientParam}`, HEADER);
        console.log(patientDetail.data.data[0].name);
        // setting the states.
        setPatientDataState(patientDetail.data.data[0]);
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
                        <h1>
                            Patient:
                            {' '}
                            <span style={{ color: `${colors.pink_header}` }}>{patientData.name}</span>
                        </h1>
                    )
                }
                <Footer />
            </div>
            <Footer />
        </>
    );
};

export default Patient;
