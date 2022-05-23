import React, { useState } from 'react';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { customStyles } from '../Search/SearchStyle';
import { StyledSelect } from './BiomarkerStyle';

// data types array
const DATA_TYPES = ['CNV', 'RNASeq'];

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

    // data type array for the selection
    const dataTypes = createSelectionArray(DATA_TYPES);

    // component states
    const [selectedDrug, updateSelectedDrug] = useState(
        selectedDrugProp ? { value: selectedDrug, label: selectedDrugProp } : ''
    );
    const [selectedGene, updateSelectedGene] = useState(
        selectedGeneProp ? { value: selectedGene, label: selectedGeneProp } : ''
    );
    const [selectedDataType, updateSelectedDataType] = useState('');
    const [isSelected, updateIsSelected] = useState({
        drug: selectedDrug ? true : false,
        gene: selectedGene ? true : false,
        dataType: false,
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
                    setBiomarkerData(biomarkers.data);
                })
                .catch(err => console.log('An error occurred', err));
        };
    };

    return (
        <StyledSelect className='biomarker-select'>
            <div className='drug-select'>
                <span> Drug * </span>
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
                    <span
                        className={!isSelected.drug && isButtonClicked ? 'visible' : 'hidden'}
                    >
                        Field is required!
                    </span>
                }
            </div>
            <div className='gene-select'>
                <span> Gene * </span>
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
                    <span
                        className={!isSelected.gene && isButtonClicked ? 'visible' : 'hidden'}
                    >
                        Field is required!
                    </span>
                }
            </div>
            <div className='genomics-select'>
                <span> Genomics * </span>
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
                    <span
                        className={!isSelected.dataType && isButtonClicked ? 'visible' : 'hidden'}
                    >
                        Field is required!
                    </span>
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
