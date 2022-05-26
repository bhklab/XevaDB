import React, { useState, useEffect } from 'react';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import ForestPlot from '../Plots/ForestPlot';
import BiomarkerSelect from './BiomarkerSelect';
import axios from 'axios';
import data from './data';
import { StyledBiomarker } from './BiomarkerStyle';


/**
 * function replaces '\s\s\s' with ' + ' in the drugs
 * @param {Array} drugs - takes a drug list
 * @returns {Array} - returns an array of modified drug list
 */
const updateDrugList = (drugs) => {
    return drugs.map(drug => drug.replace(/\s\s\s/g, ' + '));
};


/**
 * 
 * @param {Object} props 
 * @returns - Biomarker Component
 */
const Biomarker = (props) => {
    const { location } = props;

    // get gene and drug list from params
    // selected drug and selected gene from params also
    const params = new URLSearchParams(location.search);
    const geneParam = params.get('geneList');
    const selectedGene = params.get('selectedGene');
    const drugParam = params.get('drugList');
    const selectedDrug = params.get('selectedDrug');

    // gene and drug list 
    const [geneList, setGeneList] = useState([]);
    const [drugList, setDrugList] = useState([]);
    const [biomarkerData, setBiomarkerData] = useState([]);
    const [displayMessage, setDisplayMessage] = useState('');

    // function to get the drug data
    const getDrugs = async function () {
        // API call to get the list of drugs
        const drugs = await axios.get(
            '/api/v1/drugs',
            { headers: { Authorization: localStorage.getItem('user') } }
        );
        return drugs;
    };

    // function to get the gene data
    const getGenes = async function () {
        // API call to get the list of genes
        const genes = await axios.get(
            '/api/v1/genes',
            { headers: { Authorization: localStorage.getItem('user') } }
        );
        return genes;
    };

    // use effect; setting gene and drug list
    useEffect(() => {
        // setting the drug list
        if (drugParam) {
            // set drug list
            const drugs = updateDrugList(drugParam?.split(','));
            setDrugList(drugs);
        } else {
            getDrugs()
                .then(drugs => {
                    const drugArray = Object.values(drugs.data).map(el => el.drug_name);
                    // set drug list
                    setDrugList(updateDrugList(drugArray));
                })
                .catch(error => console.log(error));
        };

        // setting the gene list
        if (geneParam) {
            // set gene list
            setGeneList(geneParam?.split(','));
        } else {
            getGenes()
                .then(genes => {
                    const geneArray = Object.values(genes.data.data).map(el => el.gene_name);
                    // set gene list
                    setGeneList(geneArray);
                })
                .catch(error => console.log(error));
        };

    }, []);

    return (
        <StyledBiomarker>
            <GlobalStyles />
            <div className='wrapper'>
                <div className='biomarker-wrapper'>
                    {
                        geneList.length > 0 && drugList.length > 0 ?
                            <BiomarkerSelect
                                geneList={geneList}
                                selectedGene={selectedGene}
                                drugList={drugList}
                                selectedDrug={selectedDrug}
                                setBiomarkerData={setBiomarkerData}
                                setDisplayMessage={setDisplayMessage}
                            /> : ''
                    }
                    {
                        biomarkerData.length > 0 && displayMessage === ''
                            ? <ForestPlot data={biomarkerData} />
                            : <h1>{displayMessage}</h1>
                    }

                </div>
            </div>
            <Footer />
        </StyledBiomarker>
    )
};

export default Biomarker;
