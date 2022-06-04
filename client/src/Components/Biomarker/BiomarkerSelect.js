import React, { useState } from 'react';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { customStyles } from '../Search/SearchStyle';
import { StyledSelect } from './BiomarkerStyle';

// data types array
const DATA_TYPES = ['CNV', 'RNASeq'];

// metrics array
const METRICS = [
    'best response time',
    'lmm',
    'OS',
    'slope',
    'best response',
    'TGI',
    'best average response time',
    'AUC',
    'best average response',
    'abc',
    'angle'
];

// function to get the drug data
const createSelectionArray = function (data) {
    return data.map(el => ({
        value: el,
        label: el,
    }));
};


/**
 * 
 * @param {Object} props 
 * @returns - Biomarker Select Component
 */
const BiomarkerSelect = (props) => {
    // props
    const geneListProp = createSelectionArray(props.geneList);
    const drugListProp = createSelectionArray(props.drugList);
    const { selectedGene: selectedGeneProp } = props;
    const { selectedDrug: selectedDrugProp } = props;
    const { setBiomarkerData } = props;
    const { setDisplayMessage } = props;

    // data type array for the selection
    const dataTypes = createSelectionArray(DATA_TYPES);

    // get the list of metric types in the data
    const metrics = createSelectionArray(METRICS);

    // component states
    const [selectedDrug, updateSelectedDrug] = useState(
        selectedDrugProp ? { value: selectedDrugProp, label: selectedDrugProp } : ''
    );
    const [selectedGene, updateSelectedGene] = useState(
        selectedGeneProp ? { value: selectedGeneProp, label: selectedGeneProp } : ''
    );
    const [selectedDataType, updateSelectedDataType] = useState('');
    const [selectedMetric, updateSelectedMetric] = useState('');
    const [isSelected, updateIsSelected] = useState({
        drug: selectedDrugProp ? true : false,
        gene: selectedGeneProp ? true : false,
        dataType: false,
        metric: false,
    });
    const [isButtonClicked, updateButtonClickState] = useState(false);

    // function call the biomarker API end point to get the biomarker data
    const getBiomarkerData = async function (drug, gene, dataType) {
        const { data } = await axios.get(
            `/api/v1/biomarkers?drug=${drug}&gene=${gene}&dataType=${dataType}`,
            { headers: { Authorization: localStorage.getItem('user') } }
        );
        return data;
    };

    // function to filter data based on the metric type
    const getBiomarkerDataBasedOnMetric = function (data, metricArray) {
        // metrics array
        const metrics = metricArray.map(metric => metric.label);

        return data.filter(el => metrics.includes(el['metric'].replace(/\./g, ' ')));
    };

    // event handler on button
    const clickEventHandler = function () {
        // update button click state
        updateButtonClickState(true);

        const drug = selectedDrug.label;
        const gene = selectedGene.label;
        const dataType = selectedDataType.label;

        // get biomarker data 
        // and set the data types state
        if (drug && gene && dataType) {
            getBiomarkerData(drug, gene, dataType)
                .then(biomarkers => {
                    // update biomarker data state
                    if (biomarkers.data.length > 0) {
                        const data = selectedMetric.length > 0
                            ? getBiomarkerDataBasedOnMetric(biomarkers.data, selectedMetric)
                            : biomarkers.data;

                        setBiomarkerData(data);
                        setDisplayMessage('');
                    } else {
                        setDisplayMessage('Data is not available!');
                    };
                })
                .catch(err => console.log('An error occurred', err));
        };
    };

    // display that field is required
    const displayRequiredFieldText = function (type, isButtonClicked) {
        return (
            <span
                className={!isSelected[type] && isButtonClicked ? 'visible' : 'hidden'}
            >
                Field is required!
            </span>
        )
    };


    return (
        <StyledSelect className='biomarker-select'>
            <div className='drug-select'>
                <span> Drug* </span>
                <Select
                    styles={customStyles}
                    options={drugListProp}
                    value={selectedDrug}
                    onChange={(event) => {
                        updateSelectedDrug(event);
                        updateIsSelected({ ...isSelected, drug: true })
                    }}
                />
                {
                    displayRequiredFieldText('drug', isButtonClicked)
                }
            </div>
            <div className='gene-select'>
                <span> Gene* </span>
                <Select
                    styles={customStyles}
                    options={geneListProp}
                    value={selectedGene}
                    onChange={(event) => {
                        updateSelectedGene(event);
                        updateIsSelected({ ...isSelected, gene: true })
                    }}
                />
                {
                    displayRequiredFieldText('gene', isButtonClicked)
                }
            </div>
            <div className='genomics-select'>
                <span> Genomics* </span>
                <Select
                    styles={customStyles}
                    options={dataTypes}
                    value={selectedDataType}
                    onChange={(event) => {
                        updateSelectedDataType(event);
                        updateIsSelected({ ...isSelected, dataType: true })
                    }}
                />
                {
                    displayRequiredFieldText('dataType', isButtonClicked)
                }
            </div>
            <div className='metric-select'>
                <span> Metric* </span>
                <Select
                    styles={customStyles}
                    options={metrics}
                    value={selectedMetric}
                    onChange={(event) => {
                        updateSelectedMetric(event);
                        updateIsSelected({ ...isSelected, metric: true })
                    }}
                    isMulti
                />
                {
                    displayRequiredFieldText('metric', isButtonClicked)
                }
            </div>
            <div className='display-button'>
                <button onClick={clickEventHandler}> Display Plot </button>
            </div>
        </StyledSelect >
    )
};

export default BiomarkerSelect;


BiomarkerSelect.propTypes = {
    geneList: PropTypes.arrayOf(string).isRequired,
    drugList: PropTypes.arrayOf(string).isRequired,
    selectedDrug: PropTypes.string,
    selectedGene: PropTypes.string,
};
