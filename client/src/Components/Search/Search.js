import React from 'react'
import { withRouter } from 'react-router-dom';
import {StyleBar, customStyles, StyleButton} from './SearchStyle'
import Select from 'react-select'
import axios from 'axios'
import { GeneList } from './GeneList'
import { ConnectionBase } from 'mongoose';



class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [],
            datasets: [],
            genes: [],
            selectedGeneSearch: ['Enter Gene Symbol(s)'],
            selectedDrugs: [],
            selectedDataset: '' ,
            genomics: ['All', 'Mutation', 'CNV', 'RNASeq'],
            selectedGenomics: [],
            allDrugs: [],
            threshold: 2,
            toggleRNA: false
        }
        this.handleDrugChange = this.handleDrugChange.bind(this)
        this.handleDatasetChange = this.handleDatasetChange.bind(this)
        this.handleGeneListChange = this.handleGeneListChange.bind(this)
        this.handleGeneSearchChange = this.handleGeneSearchChange.bind(this)
        this.handleExpressionChange = this.handleExpressionChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.redirectUser = this.redirectUser.bind(this)
        this.handleThreshold = this.handleThreshold.bind(this)
    } 

    axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        }
    };

    componentWillMount() {
        const genes = GeneList.map(item => ({
            value: item.split('=')[1].replace(/\s/g, ','),
            label: `${item.split('=')[0]} (${item.split('=')[1].split(' ').length})`
        }))
    
        this.setState ({
            genes: [{value: 'user defined list', label: 'User-Defined List'}, ...genes]
        })
        
        const genomic = this.state.genomics.map((item, i) => {
            return ({
                label: item,
                value: i
            })
        })
        this.setState({
            genomics: [...genomic]
        })
    }

    componentDidMount() {
        axios.get(`/api/v1/datasets`)
            .then((response) => {
                const datasets = response.data.data.map(item => ({
                        value: item.dataset_id,
                        label: item.dataset_name
                }))
                this.setState ({
                datasets: [...datasets]
                })
            })
    }


    handleDrugChange = (selectedOption, action) => {
        if (selectedOption !== null && selectedOption.length > 0)  {
            if (selectedOption[0].value === 'all') {
                this.setState ({
                    selectedDrugs : this.state.allDrugs
                })
            }
            else {
                const label = selectedOption.map((value) => {
                    return (value.label).replace(/\s/g,'').replace('+','_');
                })
                this.setState ({
                    selectedDrugs : label
                })
            }
        }
    }

    // handle the dataset change and sends a post request to grab drugs based on the particular dataset.
    handleDatasetChange = selectedOption => {
        this.setState({
            selectedDataset: selectedOption.value
        })
        const label = selectedOption.value
        let initial = 1;
        axios.post(`/api/v1/drugpatient/dataset`, {label}, this.axiosConfig)
             .then((response) => {
                const data = response.data.data[0].map(item => ({
                    value: initial++,
                    label: item.drug
                }))
                this.setState ({
                    data: [ {value: 'all', label:'All'}, ...data]
                })
                const drug = response.data.data[0].map(item => {
                    return (item.drug).replace(/\s/g,'').replace('+','_');
                })
                this.setState ({
                    allDrugs: [...drug]
                })
             })
    }

    // sets the value of selected gene search, empty if it's user defined list else the option selected.
    handleGeneListChange = selectedOption => {
        if(selectedOption.value === 'user defined list') {
            this.setState({
                selectedGeneSearch: ''
            })
        } else {
            this.setState({
                selectedGeneSearch: selectedOption.value
            })
        }
    }

    // sets the value on event change.
    handleGeneSearchChange = (event) => {
        this.setState({
            selectedGeneSearch: event.target.value
        })
    }

    // this adds the value either mutation or cnv or rnaseq.
    handleExpressionChange = selectedOption => {
        if (selectedOption !== null && selectedOption.length > 0) {
            // map through the options in order to store the selected value.
            const genomics_value = selectedOption.map(value => {
                return value.label
            })
            // if all then everything will be passed else the selected value.
            if(genomics_value.includes('All')) {
                this.setState({
                    selectedGenomics : ['Mutation', 'CNV', 'RNASeq']
                })
            } else {
                this.setState({
                    selectedGenomics : genomics_value
                })
            }
            // and if it includes RNASeq or all then toggle should be true.
            if(genomics_value.includes('RNASeq') || genomics_value.includes('All')) {
                this.setState({
                    toggleRNA : true
                })
            } else {
                this.setState({
                    toggleRNA : false
                })
            }
        } else if (selectedOption === null || selectedOption.length === 0) {
            this.setState({
                toggleRNA : false
            })
        }
    }

    // threshold for rnaseq.
    handleThreshold = (event) => {
        this.setState({
            threshold : event.target.value
        })
    }


    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
           this.redirectUser()
        }
    }


    redirectUser = () => {
        if((this.state.selectedDataset !== '') && (this.state.selectedDrugs.length > 0) && (this.state.selectedGeneSearch[0] !== 'Enter Gene Symbol(s)')) {
            const { history } = this.props
            history.push(`/search/?drug=${this.state.selectedDrugs}&dataset=${this.state.selectedDataset}&genes=${this.state.selectedGeneSearch}&genomics=${this.state.selectedGenomics}&threshold=${this.state.threshold}`)
        }
    }


    render() {
        return (
            <StyleBar className='wrapper'>
                <div className='search-container'>
                    <div className='select-component' onKeyPress={this.handleKeyPress}>
                        <h1> <span>XevaDB:</span> A Database For PDX Pharmacogenomic Data </h1>
                        <div className='two-col'>
                            <div className='div-dataset'>
                                <Select 
                                    options={this.state.datasets} 
                                    styles={customStyles}
                                    placeholder={'Select the datasets'}
                                    onChange={this.handleDatasetChange}
                                />
                            </div>
                            <div className='div-drug'>
                                <Select 
                                    options={this.state.data} 
                                    styles={customStyles}
                                    placeholder={'Search for Drug (eg. CLR457)'}
                                    onChange={this.handleDrugChange}
                                    isMulti
                                    isSearchable
                                    isClearable
                                />
                            </div>
                        </div>
                        
                        <div className='div-genomics'> 
                            <Select 
                                options={this.state.genomics} 
                                styles={customStyles}
                                placeholder={'Genomics'}
                                onChange={this.handleExpressionChange}
                                isMulti
                                isClearable
                            />
                        </div>

                        <div className='div-rnaseq'> 
                        {
                            this.state.toggleRNA ? 
                                <div>
                                    Enter a z-score threshold ±
                                    <input 
                                        type='text' 
                                        name='title' 
                                        value={this.state.threshold} 
                                        onChange={this.handleThreshold}
                                    />
                                </div>
                            : null
                        }
                            
                        </div>

                        <div className='div-gene'>
                            <Select 
                                options={this.state.genes} 
                                styles={customStyles}
                                placeholder={'User Defined List'}
                                onChange={this.handleGeneListChange}
                            />
                        </div>

                        <div className='div-gene-enter'>
                            <form>
                                <input
                                    type='text' 
                                    value={this.state.selectedGeneSearch} 
                                    onChange={this.handleGeneSearchChange}
                                />
                            </form>
                        </div>
                        <div>
                            <StyleButton onClick={this.redirectUser} type='button'> 
                                <span>
                                    Search
                                </span>
                            </StyleButton>
                        </div>       
                    </div>
                </div>
            </StyleBar>
        )
    }
}


export default withRouter(Search)
