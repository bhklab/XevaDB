/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-deprecated */

import React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { StyleBar, customStyles, StyleButton } from './SearchStyle';
import { GeneList } from '../../utils/GeneList';
import colors from '../../styles/colors';

class Search extends React.Component {
    static parseDataset(dataset) {
        if (dataset === 'SU2C UHN (Breast Cancer)') {
            return 'UHN (Breast Cancer)';
        }
        if (dataset === 'SU2C McGill (Breast Cancer)') {
            return 'McGill (Breast Cancer)';
        }
        return dataset;
    }

    constructor(props) {
        super(props);
        this.state = {
            drugs: [],
            datasets: [],
            genes: [],
            selectedGeneSearch: ['Enter Gene Symbol(s)'],
            selectedDrugs: [],
            selectedDataset: '',
            genomicsValue: ['All', 'Mutation', 'CNV', 'Gene Expression'],
            selectedGenomics: [],
            allDrugs: [],
            threshold: 2,
            toggleRNA: false,
            genomics: [],
            drugValue: [],
            axiosConfig: {},
        };
        this.handleDrugChange = this.handleDrugChange.bind(this);
        this.handleDatasetChange = this.handleDatasetChange.bind(this);
        this.handleGeneListChange = this.handleGeneListChange.bind(this);
        this.handleGeneSearchChange = this.handleGeneSearchChange.bind(this);
        this.handleExpressionChange = this.handleExpressionChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.redirectUser = this.redirectUser.bind(this);
        this.handleThreshold = this.handleThreshold.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.clearText = this.clearText.bind(this);
    }

    componentWillMount() {
        const { genomicsValue } = this.state;
        const genes = GeneList.map((item) => ({
            value: item.split('=')[1].replace(/\s/g, ','),
            label: `${item.split('=')[0]} (${item.split('=')[1].split(' ').length})`,
        }));

        this.setState({
            genes: [{ value: 'user defined list', label: 'User-Defined List' }, ...genes],
        });

        const genomic = genomicsValue.map((item, i) => ({
            label: item,
            value: i,
        }));
        this.setState({
            genomicsValue: [...genomic],
            axiosConfig: {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    Accept: 'application/json',
                },
            },
        });
    }

    componentDidMount() {
        axios.get('/api/v1/datasets', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const datasets = response.data.datasets.map((item) => ({
                    value: item.id,
                    label: Search.parseDataset(item.name),
                }));
                this.setState({
                    datasets: [...datasets],
                });
            });
    }

    handleDrugChange(selectedOption) {
        if (selectedOption !== null && selectedOption.length > 0) {
            // destructuring the state.
            const { drugs, allDrugs } = this.state;

            // loop through the label to give the array of selectedOptions.
            const label = selectedOption.map((value) => (value.label).replace(/\s/g, '').replace('+', '_'));

            // function to check if label array contains the All string.
            const doesItContain = (labelVal) => {
                let truth = false;
                const regex = RegExp('All');
                labelVal.map((val) => {
                    if (regex.test(val)) {
                        truth = true;
                    }
                });
                return truth;
            };

            // if all is selected then everything except all is in the value for select.
            if (doesItContain(label)) {
                const data = drugs.filter((item, value) => {
                    if (value !== 0) {
                        return ({
                            value,
                            label: item.drug,
                        });
                    }
                });
                this.setState({
                    selectedDrugs: allDrugs,
                    drugValue: data,
                });
            } else { // else the selected option and label the array of drugs.
                this.setState({
                    selectedDrugs: label,
                    drugValue: selectedOption,
                });
            } // if it's empty or null put the drugValue to be an empty array.
        } else if (selectedOption === null || selectedOption.length === 0) {
            this.setState({
                drugValue: [],
            });
        }
    }

    // handle the dataset change and sends a post
    // request to grab drugs based on the particular dataset.
    handleDatasetChange(selectedOption) {
        const { axiosConfig } = this.state;
        this.setState({
            selectedDataset: selectedOption.value,
        });
        const label = selectedOption.value;
        let initial = 1;
        axios.post('/api/v1/drugpatient/dataset', { label }, { headers: { Authorization: localStorage.getItem('user') } }, axiosConfig.headers)
            .then((response) => {
                const data = response.data.data[0].map((item) => ({
                    value: initial++,
                    label: item.drug,
                }));
                this.setState({
                    drugs: [{ value: 'all', label: `All (${data.length})` }, ...data],
                });
                const drug = response.data.data[0].map((item) => (item.drug).replace(/\s/g, '').replace('+', '_'));
                this.setState({
                    allDrugs: [...drug],
                });
            });
    }

    // sets the value of selected gene search,
    // empty if it's user defined list else the option selected.
    handleGeneListChange(selectedOption) {
        if (selectedOption.value === 'user defined list') {
            this.setState({
                selectedGeneSearch: '',
            });
        } else {
            this.setState({
                selectedGeneSearch: selectedOption.value,
            });
        }
    }

    // sets the value on event change.
    handleGeneSearchChange(event) {
        this.setState({
            selectedGeneSearch: event.target.value,
        });
    }

    // this adds the value either mutation or cnv or RNASeq.
    handleExpressionChange(selectedOption) {
        const { genomicsValue } = this.state;
        if (selectedOption !== null && selectedOption.length > 0) {
            // map through the options in order to store the selected value.
            const genomicsCurrentValue = selectedOption.map((value) => value.label);

            // if all then everything will be passed else the selected value.
            if (genomicsCurrentValue.includes('All')) {
                const genomic = genomicsValue.filter((item, i) => {
                    if (i !== 0) {
                        return ({
                            label: item,
                            value: i,
                        });
                    }
                });
                this.setState({
                    genomics: genomic,
                    selectedGenomics: ['Mutation', 'CNV', 'RNASeq'],
                });
            } else {
                this.setState({
                    genomics: selectedOption,
                    selectedGenomics: genomicsCurrentValue,
                });
            }

            // and if it includes RNASeq or all then toggle should be true.
            if (genomicsCurrentValue.includes('Gene Expression') || genomicsCurrentValue.includes('All')) {
                this.setState({
                    toggleRNA: true,
                });
            } else {
                this.setState({
                    toggleRNA: false,
                });
            }
        } else if (selectedOption === null || selectedOption.length === 0) {
            this.setState({
                toggleRNA: false,
                genomics: [],
            });
        }
    }

    // threshold for GeneExpression.
    handleThreshold(event) {
        this.setState({
            threshold: event.target.value,
        });
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.redirectUser();
        }
    }

    // redirects the user to search page.
    redirectUser() {
        const {
            selectedDataset, selectedDrugs, selectedGeneSearch,
            selectedGenomics, threshold, genomics,
        } = this.state;
        // this removes spaces from gene list.
        const formatedGeneList = selectedGeneSearch.replace(/\s/g, '');
        // only renders if all the data is available.
        if ((selectedDataset !== '') && (selectedDrugs.length > 0) && (selectedGeneSearch[0] !== 'Enter Gene Symbol(s)' && selectedGeneSearch !== '') && (genomics.length > 0)) {
            const { history } = this.props;
            history.push(`/search/?drug=${selectedDrugs}&dataset=${selectedDataset}&genes=${formatedGeneList}&genomics=${selectedGenomics}&threshold=${threshold}`);
        }
    }

    // check if all fields are selected.
    checkInput() {
        const {
            selectedDataset, selectedDrugs, selectedGeneSearch, genomics,
        } = this.state;
        return ((selectedDataset !== '') && (selectedDrugs.length > 0) && (selectedGeneSearch[0] !== 'Enter Gene Symbol(s)' && selectedGeneSearch !== '') && (genomics.length > 0));
    }

    // clear the text from text area.
    clearText() {
        const { selectedGeneSearch } = this.state;
        if (selectedGeneSearch[0] === 'Enter Gene Symbol(s)') {
            this.setState({
                selectedGeneSearch: '',
            });
        }
    }

    render() {
        const {
            datasets, drugs, drugValue, genomicsValue, genomics,
            threshold, toggleRNA, genes, selectedGeneSearch,
        } = this.state;
        return (

            <StyleBar className="wrapper">
                <div className="search-container">
                    <div className="select-component" onKeyPress={this.handleKeyPress}>
                        <h1>
                            {' '}
                            <span style={{ color: `${colors.pink_header}` }}>XevaDB:</span>
                            {' '}
                            A Database For PDX Pharmacogenomic Data
                            {' '}
                        </h1>
                        <div className="two-col">
                            <div className="div-dataset">
                                <Select
                                    options={datasets}
                                    styles={customStyles}
                                    placeholder="Select the Dataset"
                                    onChange={this.handleDatasetChange}
                                />
                            </div>
                            <div className="div-drug">
                                <Select
                                    options={drugs}
                                    styles={customStyles}
                                    placeholder="Search for the Drug (eg. CLR457)"
                                    onChange={this.handleDrugChange}
                                    isMulti
                                    isSearchable
                                    isClearable
                                    value={drugValue}
                                />
                            </div>
                        </div>

                        <div className="div-genomics">
                            <Select
                                options={genomicsValue}
                                styles={customStyles}
                                placeholder="Genomics"
                                onChange={this.handleExpressionChange}
                                isMulti
                                isClearable
                                value={genomics}
                            />
                        </div>

                        <div className="div-rnaseq">
                            {
                                toggleRNA
                                    ? (
                                        <div>
                                            Enter a z-score threshold ±
                                            <input
                                                type="text"
                                                name="title"
                                                value={threshold}
                                                onChange={this.handleThreshold}
                                            />
                                        </div>
                                    )
                                    : null
                            }
                        </div>

                        <div className="div-gene">
                            <Select
                                options={genes}
                                styles={customStyles}
                                placeholder="User Defined or Pre-Defined Gene List"
                                onChange={this.handleGeneListChange}
                            />
                        </div>

                        <div className="div-gene-enter">
                            <form>
                                <textarea
                                    type="text"
                                    value={selectedGeneSearch}
                                    onChange={this.handleGeneSearchChange}
                                    onClick={this.clearText}
                                />
                            </form>
                        </div>

                        <div className="sample">
                            <a href="/search/?drug=BGJ398,binimetinib,BKM120,BYL719&dataset=1&genes=SOX9,RAN,TNK2,EP300,PXN,NCOA2,AR,NRIP1,NCOR1,NCOR2&genomics=Mutation,CNV,RNASeq&threshold=2"> Feeling Lucky? </a>
                        </div>

                        <div>
                            {
                                this.checkInput()
                                    ? (
                                        <StyleButton onClick={this.redirectUser} type="button" className="stylebutton">
                                            <span>
                                                Search
                                            </span>
                                        </StyleButton>
                                    )
                                    : (
                                        <Popup
                                            trigger={(
                                                <StyleButton onClick={this.redirectUser} type="button" className="stylebutton">
                                                    <span>
                                                        Search
                                                    </span>
                                                </StyleButton>
                                            )}
                                            position="right center"
                                        >
                                            <div style={{
                                                color: `${colors.blue_header}`, fontFamily: 'Raleway', fontSize: '17px', fontWeight: '500',
                                            }}
                                            >
                                                Complete all the fields!!
                                            </div>
                                        </Popup>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </StyleBar>
        );
    }
}

export default withRouter(Search);
