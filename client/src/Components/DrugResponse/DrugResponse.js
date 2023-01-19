import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import GlobalStyles from '../../GlobalStyles';
import SelectWrapper from './DrugResponseStyle';
import { customStyles } from '../Search/SearchStyle';
import Footer from '../Footer/Footer';

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
 * transforms the input data for the selection
 * @param {Array} data - input data
 * @returns {Array} - returns transformed array of objects
 */
const transformDrugsForSelection = (data) => (
    data.map((el) => ({
        value: el.drug_id,
        label: el.drug,
    }))
);

/**
 * @param {Object} selectedDataset - selected data object
 * @param {Object} updateDrugListState - to update the drug list state
 */
const getDrugListOnDatasetChange = (selectedDataset, updateDrugListState) => {
    const { value: datasetId } = selectedDataset;

    axios
        .post(
            '/api/v1/drugspatients/dataset',
            { datasetId },
            { headers: { Authorization: localStorage.getItem('user') } },
            {
                'Content-Type': 'application/json;charset=UTF-8',
                Accept: 'application/json',
            },
        )
        .then((data) => {
            const [drugs] = data.data.data;
            console.log(drugs);
            updateDrugListState(transformDrugsForSelection(drugs));
        });
};

/**
 * Main response component
 */
const DrugResponse = () => {
    const [datasetList, updateDatasetList] = useState([]);
    const [drugList, updateDrugList] = useState([]);

    useEffect(() => {
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
                            onChange={(d) => getDrugListOnDatasetChange(d, updateDrugList)}
                        />
                    </div>
                    <div className='drug-select'>
                        <span> Drug* </span>
                        <Select
                            styles={customStyles}
                            options={drugList}
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
