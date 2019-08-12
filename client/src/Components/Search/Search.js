import React from 'react'
import { withRouter } from 'react-router-dom';
import {StyleBar, customStyles, StyleButton} from './SearchStyle'
import Select from 'react-select'
import axios from 'axios'
import { GeneList } from './GeneList'



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
            genomics: ['Mutation', 'CNV', 'RNASeq'],
            allDrugs: []
        }
        this.handleDrugChange = this.handleDrugChange.bind(this)
        this.handleDatasetChange = this.handleDatasetChange.bind(this)
        this.handleGeneListChange = this.handleGeneListChange.bind(this)
        this.handleGeneSearchChange = this.handleGeneSearchChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.redirectUser = this.redirectUser.bind(this)
    } 

    axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        }
    };

    componentWillMount() {
        const genes = GeneList.map(item => ({
            value: item.split('=')[1].replace(/\s/g, ","),
            label: item.split('=')[0]
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
        axios.get(`http://localhost:5000/api/v1/dataset`)
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
        if(selectedOption[0].value === 'all') {
            this.setState ({
                selectedDrugs : this.state.allDrugs
            })
        }
        else if (selectedOption !== null && selectedOption.length > 0) {
            const label = selectedOption.map((value) => {
                return (value.label).replace(/\s/g,'').replace('+','_');
            })
            this.setState ({
                selectedDrugs : label
            })
        }
    }

    handleDatasetChange = selectedOption => {
        this.setState({
            selectedDataset: selectedOption.value
        })
        const label = selectedOption.value
        let initial = 1;
        axios.post(`http://localhost:5000/api/v1/drug/dataset`, {label}, this.axiosConfig)
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


    handleGeneSearchChange = (event) => {
        this.setState({
            selectedGeneSearch: event.target.value
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
            history.push(`/search/?drug=${this.state.selectedDrugs}&dataset=${this.state.selectedDataset}&genes=${this.state.selectedGeneSearch}`)
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
                            />
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
                                    type="text" 
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
