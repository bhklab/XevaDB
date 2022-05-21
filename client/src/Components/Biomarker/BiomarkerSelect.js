import React, { useEffect, useState } from 'react';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { customStyles } from '../Search/SearchStyle';
import { StyledSelect } from './BiomarkerStyle';


/**
 * 
 * @param {Array} data - array of input data
 */
const getAllDataTypes = (data) => {
    // variable to store the different data types.
    const dataTypes = [];
    // looping through and storing the data type if it's not already present.
    data.forEach(el => {
        if (!dataTypes.includes(el.mDataType)) {
            dataTypes.push(el.mDataType);
        }
    });
    return dataTypes;
};

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

    const geneListProp = createSelectionArray(props.geneList);
    const drugListProp = createSelectionArray(props.drugList);
    const { selectedGene: selectedGeneProp } = props;
    const { selectedDrug: selectedDrugProp } = props;

    // component states
    const [dataTypes, setDataTypes] = useState([]);
    const [biomarkerData, setBiomarkerData] = useState([]);
    const [selectedDrug, updateSelectedDrug] = useState(selectedDrugProp);
    const [selectedGene, updateSelectedGene] = useState(selectedGeneProp);

    // function call the biomarker API end point to get the biomarker data
    const getBiomarkerData = async function () {
        const { data } = await axios.get(
            `/api/v1/biomarkers?drug=BGJ398&gene=TP53`,
            { headers: { Authorization: localStorage.getItem('user') } }
        );
        return data;
    };

    useEffect(() => {
        // get biomarker data 
        // and set the data types state
        getBiomarkerData()
            .then(biomarkers => {
                // update biomarker data state
                setBiomarkerData(biomarkers.data);

                // get the data types
                const datatypes = getAllDataTypes(biomarkers.data);
                // update data type state and set the data type state
                const datatypeObject = createSelectionArray(datatypes);
                setDataTypes(datatypeObject);
            })
            .catch(err => console.log('An error occurred', err));
    }, []);

    return (
        <StyledSelect className='biomarker-select'>
            <div className='drug-select'>
                <span> Select Drug </span>
                <Select
                    styles={customStyles}
                    options={drugListProp}
                    defaultValue={
                        selectedDrugProp ? { value: selectedDrug, label: selectedDrugProp } : ''
                    }
                />
            </div>
            <div className='gene-select'>
                <span> Select Gene </span>
                <Select
                    styles={customStyles}
                    options={geneListProp}
                    defaultValue={
                        selectedGeneProp ? { value: selectedGene, label: selectedGeneProp } : ''
                    }
                />
            </div>
            <div className='genomics-select'>
                <span> Select Genomics </span>
                <Select
                    styles={customStyles}
                    options={dataTypes}
                />
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
