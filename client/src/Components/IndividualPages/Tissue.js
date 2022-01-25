import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Utils/Spinner';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import IdentedTree from '../Plots/IndentedTree';

// header constant.
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };

// transform the data for indented tree.
const transformIndentedTreeData = (data) => {
    const transformedData = {
        name: data.name,
        children: [],
    };
    // looping through the datasets.
    Object.values(data.datasets).forEach((element) => {
        const patients = element.patients.map((el) => ({ name: el }));
        const models = element.models.map((el) => ({ name: el }));
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
                {
                    name: 'Models',
                    children: models,
                },
            ],
        });
    });
    return transformedData;
};

// Tissue Component.
const Tissue = (props) => {
    // grab the tissue params id.
    const { match: { params: { id: tissueParam } } } = props;

    // tissue and data loader state.
    const [tissueData, setTissueDataState] = useState({});
    const [loading, setLoader] = useState(true);

    // query to fetch the tissue detail.
    const fetchData = async () => {
        // API call to fetch the data from tissue detailed information API.
        const tissueInformation = await axios.get(`/api/v1/tissues/details/${tissueParam}`, HEADER);
        // setting the tissue data state after transforming the data.
        setTissueDataState(
            transformIndentedTreeData(Object.values(tissueInformation.data.data)[0]),
        );
        setLoader(false);
    };

    // use effect hook.
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
                                {tissueData.name}
                            </h1>
                            <IdentedTree data={tissueData} />
                            <Footer />
                        </>
                    )
                }
            </div>
            <Footer />
        </>
    );
};

export default Tissue;
