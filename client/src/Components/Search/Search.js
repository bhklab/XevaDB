/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-deprecated */

import React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { StyleBar, customStyles, StyleButton } from './SearchStyle';
import { GeneList } from './GeneList';


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drugs: [],
            datasets: [],
            genes: [],
            selectedGeneSearch: ['Enter Gene Symbol(s)'],
            selectedDrugs: [],
            selectedDataset: '',
            genomicsValue: ['All', 'Mutation', 'CNV', 'RNASeq'],
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
        axios.get('/api/v1/datasets')
            .then((response) => {
                const datasets = response.data.data.map((item) => ({
                    value: item.dataset_id,
                    label: item.dataset_name,
                }));
                this.setState({
                    datasets: [...datasets],
                });
            });
    }


    handleDrugChange(selectedOption) {
        if (selectedOption !== null && selectedOption.length > 0) {
            const { drugs, allDrugs } = this.state;

            // if all is selected then everything except all is in the value for select.
            if (selectedOption[0].value === 'all') {
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
                const label = selectedOption.map((value) => (value.label).replace(/\s/g, '').replace('+', '_'));
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
        axios.post('/api/v1/drugpatient/dataset', { label }, axiosConfig.headers)
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

    // this adds the value either mutation or cnv or rnaseq.
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
            if (genomicsCurrentValue.includes('RNASeq') || genomicsCurrentValue.includes('All')) {
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

    // threshold for rnaseq.
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


    redirectUser() {
        const {
            selectedDataset, selectedDrugs, selectedGeneSearch, selectedGenomics, threshold,
        } = this.state;
        if ((selectedDataset !== '') && (selectedDrugs.length > 0) && (selectedGeneSearch[0] !== 'Enter Gene Symbol(s)')) {
            const { history } = this.props;
            history.push(`/search/?drug=${selectedDrugs}&dataset=${selectedDataset}&genes=${selectedGeneSearch}&genomics=${selectedGenomics}&threshold=${threshold}`);
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
                            <span>XevaDB:</span>
                            {' '}
A Database For PDX Pharmacogenomic Data
                            {' '}
                        </h1>
                        <div className="two-col">
                            <div className="div-dataset">
                                <Select
                                    options={datasets}
                                    styles={customStyles}
                                    placeholder="Select the datasets"
                                    onChange={this.handleDatasetChange}
                                />
                            </div>
                            <div className="div-drug">
                                <Select
                                    options={drugs}
                                    styles={customStyles}
                                    placeholder="Search for Drug (eg. CLR457)"
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
                                placeholder="User Defined List"
                                onChange={this.handleGeneListChange}
                            />
                        </div>

                        <div className="div-gene-enter">
                            <form>
                                <textarea
                                    type="text"
                                    value={selectedGeneSearch}
                                    onChange={this.handleGeneSearchChange}
                                />
                            </form>
                        </div>
                        <div>
                            <StyleButton onClick={this.redirectUser} type="button">
                                <span>
                                    Search
                                </span>
                            </StyleButton>
                        </div>
                    </div>
                </div>
            </StyleBar>
        );
    }
}


export default withRouter(Search);
