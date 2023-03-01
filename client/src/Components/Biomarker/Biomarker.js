import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import ForestPlot from '../Plots/ForestPlot';
import BiomarkerSelect from './BiomarkerSelect';
import { StyledBiomarker } from './BiomarkerStyle';
import Spinner from '../Utils/Spinner';

/**
 * function replaces '\s\s\s' with ' + ' in the drugs
 * @param {Array} drugs - takes a drug list
 * @returns {Array} - returns an array of modified drug list
 */
const updateDrugList = (drugs) => drugs.map((drug) => drug.replace(/\s\s\s/g, ' + '));

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
    const [geneList, setGeneList] = useState(geneParam?.split(',') || []);
    const [drugList, setDrugList] = useState(drugParam?.split(',') || []);
    const [biomarkerData, setBiomarkerData] = useState([]);
    const [displayMessage, setDisplayMessage] = useState('');
    const [isBiomarkerDataLoading, setBiomarkerDataLoadingState] = useState(false);

    // function to get the drug data
    function getDrugs() {
        // API call to get the list of drugs
        return axios.get(
            '/api/v1/drugs',
            { headers: { Authorization: localStorage.getItem('user') } },
        );
    }

    // function to get the gene data
    function getGenes() {
        // API call to get the list of genes
        return axios.get(
            '/api/v1/genes',
            { headers: { Authorization: localStorage.getItem('user') } },
        );
    }

    // use effect; setting gene and drug list
    useEffect(() => {
        // setting the drug list
        if (drugList.length === 0) {
            getDrugs()
                .then((drugs) => {
                    const drugArray = Object.values(drugs.data).map((el) => el.drug_name);
                    // set drug list
                    setDrugList(updateDrugList(drugArray));
                })
                .catch((error) => console.log(error));
        }

        // setting the gene list
        if (geneList.length === 0) {
            getGenes()
                .then((genes) => {
                    const geneArray = Object.values(genes.data.data).map((el) => el.gene_name);
                    // set gene list
                    setGeneList(geneArray);
                })
                .catch((error) => console.log(error));
        }
    }, []);

    // function to render forest plot
    function renderForestPlot() {
        let returnElement;

        if (displayMessage) {
            returnElement = <h1>{displayMessage}</h1>;
        }

        if (biomarkerData.length > 0 && displayMessage === '') {
            returnElement = <ForestPlot data={biomarkerData} />;
        }

        if (isBiomarkerDataLoading) {
            returnElement = <Spinner loading />;
        }

        return returnElement;
    }

    // function to render the component
    function renderComponent() {
        return (
            <>
                <BiomarkerSelect
                    geneList={geneList}
                    selectedGene={selectedGene}
                    drugList={drugList}
                    selectedDrug={selectedDrug}
                    setBiomarkerData={setBiomarkerData}
                    setDisplayMessage={setDisplayMessage}
                    setBiomarkerDataLoadingState={setBiomarkerDataLoadingState}
                />
                {
                    renderForestPlot()
                }
            </>
        );
    }

    return (
        <StyledBiomarker>
            <GlobalStyles />
            <div className='wrapper'>
                <div className='biomarker-wrapper'>
                    {
                        geneList.length > 0 && drugList.length > 0
                            ? renderComponent()
                            : <Spinner loading />
                    }
                </div>
            </div>
            <Footer />
        </StyledBiomarker>
    );
};

export default Biomarker;
