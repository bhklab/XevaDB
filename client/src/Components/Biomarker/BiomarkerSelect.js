/* eslint-disable func-names */
import React, { useEffect, useState } from 'react';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import ReactSelect, { createFilter } from 'react-select';
import { customStyles } from '../Search/SearchStyle';
import { StyledSelect } from './BiomarkerStyle';
import CustomMenuList from './CustomMenuList';

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
    'angle',
];

const DEFAULT_METRIC = 'AUC';

// function to get the drug data
function createSelectionArray(data) {
    return data.map((el) => ({
        value: el,
        label: el,
    }));
}

// function call the biomarker API end point to get the biomarker data
async function getBiomarkerData(drug, gene, dataType) {
    const { data } = await axios.get(
        `/api/v1/biomarkers?drug=${drug}&gene=${gene}&dataType=${dataType}`,
        { headers: { Authorization: localStorage.getItem('user') } },
    );
    return data;
}

// function to filter data based on the metric type
function getBiomarkerDataBasedOnMetric(data, metric) {
    return data.filter(
        (el) => metric.toLowerCase() === el.metric.replace(/\./g, ' ').toLowerCase(),
    );
}

/**
 *
 * @param {Object} props
 * @returns - Biomarker Select Component
 */
const BiomarkerSelect = (props) => {
    // props
    const {
        geneList,
        drugList,
    } = props;
    const geneListProp = createSelectionArray(geneList);
    const drugListProp = createSelectionArray(drugList);
    const { selectedGene: geneProp } = props;
    const { selectedDrug: drugProp } = props;
    const { setBiomarkerData: setBiomarkerDataForForestPlot } = props;
    const { setDisplayMessage } = props;

    // data type and metric data for the selections
    const dataTypes = createSelectionArray(DATA_TYPES);
    const metrics = createSelectionArray(METRICS);

    // component states
    const [biomarkerData, setBiomarkerData] = useState([]);
    const [selectedDrug, updateSelectedDrug] = useState(
        drugProp ? {
            value: drugProp,
            label: drugProp,
        } : '',
    );
    const [selectedGene, updateSelectedGene] = useState(
        geneProp ? {
            value: geneProp,
            label: geneProp,
        } : '',
    );
    const [selectedDataType, updateSelectedDataType] = useState('');
    const [selectedMetric, updateSelectedMetric] = useState({
        value: DEFAULT_METRIC,
        label: DEFAULT_METRIC,
    });
    const [isSelected, updateIsSelected] = useState({
        drug: !!drugProp,
        gene: !!geneProp,
        dataType: false,
        metric: true,
        dataset: true,
    });
    const [isButtonClicked, updateButtonClickState] = useState(false);

    useEffect(() => {
        const drug = selectedDrug.label;
        const gene = selectedGene.label;
        const dataType = selectedDataType.label;
        const metric = selectedMetric.label;

        if (drug && gene && dataType && isButtonClicked) {
            getBiomarkerData(drug, gene, dataType)
                .then((biomarkers) => {
                    if (biomarkers.data?.length > 0) {
                        const data = metric
                            ? getBiomarkerDataBasedOnMetric(biomarkers.data, metric)
                            : biomarkers.data;

                        setBiomarkerData(biomarkers.data);
                        setBiomarkerDataForForestPlot(data);
                        setDisplayMessage('');
                    } else {
                        setDisplayMessage('Data is not available!');
                    }
                })
                .catch((err) => console.log('An error occurred', err));
        }
    }, [selectedDrug, selectedGene, selectedDataType, isButtonClicked]);

    useEffect(() => {
        const metric = selectedMetric.label;
        if (metric) {
            const dataBasedOnMetric = getBiomarkerDataBasedOnMetric(biomarkerData, metric);
            setBiomarkerDataForForestPlot(dataBasedOnMetric);
        }
    }, [selectedMetric]);

    // event handler on button
    const buttonClickEventHandler = function () {
        // update button click state
        updateButtonClickState(true);
    };

    // display that field is required
    const displayRequiredFieldText = function (type, isButtonClicked) {
        return (
            <span
                className={!isSelected[type] && isButtonClicked ? 'visible' : 'hidden'}
            >
                Field is required!
            </span>
        );
    };

    return (
        <StyledSelect className='biomarker-select'>
            <div className='drug-select'>
                <span> Drug* </span>
                <ReactSelect
                    styles={customStyles}
                    options={drugListProp}
                    value={selectedDrug}
                    onChange={(event) => {
                        updateSelectedDrug(event);
                        updateIsSelected({
                            ...isSelected,
                            drug: true,
                        });
                    }}
                    filterOption={createFilter({ ignoreAccents: false })}
                />
                {
                    displayRequiredFieldText('drug', isButtonClicked)
                }
            </div>
            <div className='gene-select'>
                <span> Gene* </span>
                <ReactSelect
                    styles={customStyles}
                    options={geneListProp}
                    value={selectedGene}
                    onChange={(event) => {
                        updateSelectedGene(event);
                        updateIsSelected({
                            ...isSelected,
                            gene: true,
                        });
                    }}
                    filterOption={createFilter({ ignoreAccents: false })}
                    components={{
                        MenuList: CustomMenuList,
                    }}
                    captureMenuScroll={false}
                />
                {
                    displayRequiredFieldText('gene', isButtonClicked)
                }
            </div>
            <div className='genomics-select'>
                <span> Genomics* </span>
                <ReactSelect
                    styles={customStyles}
                    options={dataTypes}
                    value={selectedDataType}
                    onChange={(event) => {
                        updateSelectedDataType(event);
                        updateIsSelected({
                            ...isSelected,
                            dataType: true,
                        });
                    }}
                    filterOption={createFilter({ ignoreAccents: false })}
                />
                {
                    displayRequiredFieldText('dataType', isButtonClicked)
                }
            </div>
            <div className='metric-select'>
                <span> Metric </span>
                <ReactSelect
                    styles={customStyles}
                    options={metrics}
                    value={selectedMetric}
                    onChange={(event) => {
                        updateSelectedMetric(event);
                        updateIsSelected({
                            ...isSelected,
                            metric: true,
                        });
                    }}
                    filterOption={createFilter({ ignoreAccents: false })}
                />
                {
                    displayRequiredFieldText('metric', isButtonClicked)
                }
            </div>
            <div className='display-button'>
                <button type='button' onClick={buttonClickEventHandler}> Display plot</button>
            </div>
        </StyledSelect>
    );
};

export default BiomarkerSelect;

BiomarkerSelect.propTypes = {
    geneList: PropTypes.arrayOf(string).isRequired,
    drugList: PropTypes.arrayOf(string).isRequired,
    selectedDrug: PropTypes.string,
    selectedGene: PropTypes.string,
    // setBiomarkerData:,
    // setDisplayMessage:,
};

BiomarkerSelect.defaultProps = {
    selectedDrug: '',
    selectedGene: '',
};
