import React from 'react';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import ForestPlot from '../Plots/ForestPlot';
import BiomarkerSelect from './BiomarkerSelect';
import data from './data';
import { StyledBiomarker } from './BiomarkerStyle';

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


/**
 * 
 * @param {Object} props 
 * @returns - Biomarker Component
 */
const Biomarker = (props) => {
    const { location } = props;
    // get genes param
    const params = new URLSearchParams(location.search);
    const geneList = params.get('geneList');
    const selectedGene = params.get('selectedGene');
    const drugList = params.get('drugList');
    const selectedDrug = params.get('selectedDrug');
    const mDataTypes = getAllDataTypes(data.gctd);

    console.log(geneList, selectedDrug, selectedGene, drugList);

    return (
        <StyledBiomarker>
            <GlobalStyles />
            <div className='wrapper'>
                <div className='biomarker-wrapper'>
                    <BiomarkerSelect
                        geneList={geneList}
                        selectedGene={selectedGene}
                        drugList={drugList}
                        selectedDrug={selectedDrug}
                        dataTypes={mDataTypes}
                    />
                    <ForestPlot data={data.gctd} />
                </div>
            </div>
            <Footer />
        </StyledBiomarker>
    )
};

export default Biomarker;
