import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import styled from 'styled-components';
import GlobalStyles from '../../GlobalStyles';
import colors from '../../styles/colors';
import { customStyles } from '../Search/SearchStyle';
import Footer from '../Footer/Footer';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const SelectWrapper = styled.div`
    margin-top: 40px;
    padding: 20px;
    width: 45vw;
    display: flex;
    gap: 40px;

    .dataset-select, .drug-select {
        width: 100%;
    }

    span {
        margin-bottom: 5px;
        color: ${colors['--main-font-color']};
        font-size: 1em;
        font-weight: 500;
        display: inline-block;
    }

    button {
        width: 110px;
        padding: 10px;
        background-color: ${colors['--bg-color']};
        border: 0;
        border-radius: 5px;
        font-size: 1rem;
        color: ${colors.white};
    }

    button:hover {
        cursor: pointer;
    }

    @media only screen and (max-width: 2100px) {
        width: 55vw;
    }

    @media only screen and (max-width: 1600px) {
        width: 60vw;
    }

    @media only screen and (max-width: 1400px) {
        width: 70vw;
    }
`;

/**
 * transforms the input data for the selection
 * @param {Array} data - input data
 * @returns {Array} - returns transformed array of objects
 */
const transformDataForSelection = (data) => (
    data.map((el) => ({
        value: el.id,
        label: el.name,
    }))
);

/**
 * Main response component
 */
const DrugResponse = () => {
    const [datasetList, updateDatasetList] = useState([]);
    const [selectedDataset, updateSelectedDataset] = useState();

    useEffect(() => {
        console.log('is useefefefef----');
        axios
            .get('/api/v1/datasets', { headers: { Authorization: localStorage.getItem('user') } })
            .then((data) => data.data.datasets)
            .then((datasets) => transformDataForSelection(datasets))
            .then((transformedDatasets) => updateDatasetList(transformedDatasets));
    }, []);

    return (
        <div>
            <GlobalStyles />
            <div className='wrapper'>
                <SelectWrapper>
                    <div className='dataset-select'>
                        <span> Dataset* </span>
                        <Select
                            styles={customStyles}
                            options={datasetList}
                            onChange={(d) => console.log(d)}
                        />
                    </div>
                    <div className='drug-select'>
                        <span> Drug* </span>
                        <Select
                            styles={customStyles}
                            options={options}
                        />
                    </div>
                    <div className='display-button'>
                        &nbsp;
                        <button type='button'> Display plot </button>
                    </div>
                </SelectWrapper>
            </div>
            <Footer />
        </div>
    );
};

export default DrugResponse;
