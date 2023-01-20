import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import GlobalStyles from '../../GlobalStyles';
import SelectWrapper from './DrugResponseStyle';
import { customStyles } from '../Search/SearchStyle';
import Footer from '../Footer/Footer';
import HeatMapData from '../Plots/HeatMap/HeatMapData';

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
 * @param {Object} datasetId - id of the dataset
 */
const getDrugListOnDatasetId = (datasetId) => axios
    .post(
        '/api/v1/drugspatients/dataset',
        { datasetId },
        { headers: { Authorization: localStorage.getItem('user') } },
        {
            'Content-Type': 'application/json;charset=UTF-8',
            Accept: 'application/json',
        },
    );

/**
 * Main response component
 */
const DrugResponse = () => {
    const [datasetList, updateDatasetList] = useState([]);
    const [selectedDatasetId, setSelectedDataset] = useState();
    const [drugList, updateDrugList] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState();
    const [displayPlot, updateDisplayPlot] = useState(false);

    useEffect(() => {
        axios
            .get('/api/v1/datasets', { headers: { Authorization: localStorage.getItem('user') } })
            .then((data) => data.data.datasets)
            .then((datasets) => transformDataForSelection(datasets))
            .then((transformedDatasets) => updateDatasetList(transformedDatasets));
    }, []);

    // function handling the dataset selection
    function handleDatasetChange(d) {
        // set the selected dataset
        setSelectedDataset(d.value);

        // set the drug list based on the selected dataset
        getDrugListOnDatasetId(d.value)
            .then((data) => {
                const [drugs] = data.data.data;
                updateDrugList(transformDrugsForSelection(drugs));
            });
    }

    // function handling the drug selection(s)
    function handleDrugChange(d) {
        const drugs = d.reduce((drugString, currentDrug) => {
            if (drugString) {
                return `${drugString},${currentDrug.label.replaceAll(' ', '').replaceAll('+', '_')}`;
            }
            return `${currentDrug.label.replaceAll(' ', '').replaceAll('+', '_')}`;
        }, '');
        console.log(drugs, selectedDatasetId);
        // set the drug selection state
        setSelectedDrugs(drugs);
    }

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
                            onChange={(d) => handleDatasetChange(d)}
                        />
                    </div>
                    <div className='drug-select'>
                        <span> Drug* </span>
                        <Select
                            isMulti
                            styles={customStyles}
                            options={drugList}
                            onChange={(d) => handleDrugChange(d)}
                        />
                    </div>
                    <div className='display-button'>
                        &nbsp;
                        <button type='button' onClick={() => updateDisplayPlot(true)}> Display plot </button>
                    </div>
                </SelectWrapper>
                <div className='heatmap-plot'>
                    {
                        displayPlot
                            ? (
                                <HeatMapData
                                    datasetId={selectedDatasetId}
                                    drugList={selectedDrugs}
                                />
                            )
                            : ''
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DrugResponse;
