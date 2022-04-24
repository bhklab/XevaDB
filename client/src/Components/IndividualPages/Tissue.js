import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Utils/Spinner';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import IdentedTree from '../Plots/IndentedTree';
import ErrorComponent from '../Utils/Error';


// transform the data for indented tree.
const transformIndentedTreeData = (data) => {
    const transformedData = {
        name: data.name,
        children: [],
    };
    // looping through the datasets.
    Object.values(data.datasets).forEach((element) => {
        const patients = element.patients.map((el) => ({ name: el }));
        // const models = element.models.map((el) => ({ name: el }));
        const drugs = element.drugs.map((el) => ({ name: el }));

        transformedData.children.push({
            name: element.name,
            children: [
                {
                    name: 'Drugs',
                    children: drugs,
                },
                {
                    name: 'Patients',
                    children: patients,
                },
                // {
                //     name: 'Models',
                //     children: models,
                // },
            ],
        });
    });
    return transformedData;
};


/**
 * 
 * @param {Object} props - props object
 * @returns {Component} - returns the tissue component for tissue individual page
 */
const Tissue = (props) => {
    // grab the tissue params id.
    const { match: { params: { id: tissueParam } } } = props;

    // tissue and data loader state.
    const [tissueData, setTissueDataState] = useState({});
    const [loading, setLoader] = useState(true);
    const [error, setError] = useState('');

    // use effect hook.
    useEffect(() => {
        // fetching the data.
        fetchData()
            .then((result) => {
                // setting the tissue data state after transforming the data.
                const transformedData = transformIndentedTreeData(Object.values(result.data.data)[0]);
                // update the state
                setTissueDataState(transformedData);
                setLoader(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoader(false);
            });
    }, []);

    // query to fetch the tissue detail.
    const fetchData = async () => {
        // API call to fetch the data from tissue detailed information API.
        try {
            return await axios.get(
                `/api/v1/tissues/details/${tissueParam}`,
                { headers: { Authorization: localStorage.getItem('user') } }
            );
        } catch (error) {
            throw new Error('An Error Occurred!!');
        }
    };

    // function to output the data
    const renderOutput = (loading, data, error) => {
        // if data is loading!
        if (loading) {
            return <Spinner loading={loading} />
        }

        // if there is an error!
        if (error) {
            return <ErrorComponent message={error} />
        }

        // returns the data to be rendered in case it's not loading and no errors!
        return (
            <div className='component-wrapper center-component'>
                <h1> {data.name} </h1>
                <IdentedTree data={data} />
            </div>
        )
    };


    return (
        <>
            <GlobalStyles />
            <div className="wrapper">
                {
                    renderOutput(loading, tissueData, error)
                }
            </div>
            <Footer />
        </>
    );
};


export default Tissue;
