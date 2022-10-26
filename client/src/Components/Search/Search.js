import React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { StyleBar, customStyles, StyleButton } from './SearchStyle';
import { GeneList } from '../../utils/GeneList';
import feelingLuckyRequest from '../../utils/FeelingLuckyRequest';
import colors from '../../styles/colors';

class Search extends React.Component {
    static mapDataset(dataset) {
        if (dataset === 'McGill TNBC') {
            return 'McGill (Breast Cancer)';
        }
        return dataset;
    }

    constructor(props) {
        super(props);
        this.state = {
            drugs: [],
            datasets: [],
            genes: this.getGenesSelectOptions(GeneList),
            selectedGeneSearch: ['Enter Gene Symbols (Max 50 genes)'],
            selectedDrugs: [],
            selectedDataset: '',
            genomicsValue: ['All', 'Mutation', 'CNV', 'Gene Expression'].map((item, i) => ({
                label: item,
                value: i,
            })),
            selectedGenomics: [],
            allDrugs: [],
            threshold: 2,
            toggleRNA: false,
            genomics: [],
            drugValue: [],
            axiosConfig: {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    Accept: 'application/json',
                },
            },
            geneLimit: 50,
        };
    }

    componentDidMount() {
        axios.get('/api/v1/datasets', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const datasets = response.data.datasets.map((item) => ({
                    value: item.id,
                    label: Search.mapDataset(item.name),
                }));
                this.setState({
                    datasets: [...datasets],
                });
            });
    }

    getGenesSelectOptions = (geneList) => {
        const genes = geneList.map((item) => ({
            value: item.split('=')[1].replace(/\s/g, ','),
            label: `${item.split('=')[0]} (${item.split('=')[1].split(' ').length})`,
        }));

        return (
            [{ value: 'user defined list', label: 'User-Defined List (Max 50 genes)' }, ...genes]
        );
    };

    handleDrugChange = (selectedOption) => {
        if (selectedOption !== null && selectedOption.length > 0) {
            // destructuring the state.
            const { drugs, allDrugs } = this.state;

            // loop through the label to give the array of selectedOptions.
            const label = selectedOption.map((value) => (value.label).replace(/\s/g, '').replace(/\+/ig, '_'));

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
    handleDatasetChange = (selectedOption) => {
        const { axiosConfig } = this.state;
        this.setState({
            selectedDataset: selectedOption.value,
        });
        const label = selectedOption.value;
        let initial = 1;
        axios.post('/api/v1/drugspatients/dataset', { label }, { headers: { Authorization: localStorage.getItem('user') } }, axiosConfig.headers)
            .then((response) => {
                const data = response.data.data[0].map((item) => ({
                    value: initial++,
                    label: item.drug,
                }));
                this.setState({
                    drugs: [{ value: 'all', label: `All (${data.length})` }, ...data],
                });
                const drug = response.data.data[0].map((item) => (item.drug).replace(/\s/g, '').replace(/\+/ig, '_'));
                this.setState({
                    allDrugs: [...drug],
                });
            });
    }

    // sets the value of selected gene search,
    // empty if it's user defined list else the option selected.
    handleGeneListChange = (selectedOption) => {
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
    handleGeneSearchChange = (event) => {
        this.setState({
            selectedGeneSearch: event.target.value,
        });
    }

    // this adds the value either mutation or cnv or RNASeq.
    handleExpressionChange = (selectedOption) => {
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
    handleThreshold = (event) => {
        this.setState({
            threshold: event.target.value,
        });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.redirectUser();
        }
    }

    // checks if all the data is available.
    ifAllDataAvailable = () => {
        const {
            selectedDataset, selectedDrugs, selectedGeneSearch, genomics,
        } = this.state;

        return (
            (selectedDataset !== '')
            && (selectedDrugs.length > 0)
            && (selectedGeneSearch[0] !== 'Enter Gene Symbol(s)' && selectedGeneSearch !== '')
            && (genomics.length > 0)
        );
    }

    // checks if the gene list entered by the user is less than 50 in number
    ifGeneNumberLessThanFifty = () => {
        const { selectedGeneSearch } = this.state;
        // gene length
        const geneLength = typeof (selectedGeneSearch) === 'string' && selectedGeneSearch.split(',').length;
        // return true/false based on the length
        return geneLength < this.state.geneLimit;
    }

    // redirects the user to search page.
    redirectUser = () => {
        const {
            selectedDataset, selectedDrugs, selectedGeneSearch,
            selectedGenomics, threshold,
        } = this.state;
        // this removes spaces from gene list.
        const formatedGeneList = selectedGeneSearch.replace(/\s/g, '');
        // only renders if all the data is available.
        if (this.ifAllDataAvailable() && this.ifGeneNumberLessThanFifty()) {
            const { history } = this.props;
            history.push(`/search/?drug=${selectedDrugs}&dataset=${selectedDataset}&genes=${formatedGeneList}&genomics=${selectedGenomics}&threshold=${threshold}`);
        }
    }

    // clear the text from text area.
    clearText = () => {
        const { selectedGeneSearch } = this.state;
        if (selectedGeneSearch[0] === 'Enter Gene Symbol(s)') {
            this.setState({
                selectedGeneSearch: '',
            });
        }
    }

    // text for the pop up
    popupText = () => {
        if (this.state.selectedGeneSearch.length > 1) {
            return this.ifGeneNumberLessThanFifty() ? 'Complete all the fields!' : 'Please keep gene list less than 50!';
        }
        return 'Complete all the fields!';
    }

    render() {
        const {
            datasets, drugs, drugValue, genomicsValue, genomics,
            threshold, toggleRNA, genes, selectedGeneSearch,
        } = this.state;
        return (
            <StyleBar className="wrapper">
                <div className="search-container center-component">
                    <h1>
                        XevaDB: A Database For PDX Pharmacogenomic Data
                    </h1>
                    <div className="select-component" onKeyPress={this.handleKeyPress}>
                        <div className="dataset-drug-container">
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
                                placeholder="Molecular Alteration"
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
                            <a href={`${feelingLuckyRequest}`}> Feeling Lucky? </a>
                        </div>

                        <div className="search-button">
                            {
                                this.ifAllDataAvailable() && this.ifGeneNumberLessThanFifty()
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
                                                color: `${colors['--bg-color']}`, fontSize: '0.9em', fontWeight: '300',
                                            }}
                                            >
                                                {this.popupText()}
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
