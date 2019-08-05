import React from 'react'
import { withRouter } from 'react-router-dom';
import {StyleBar, customStyles, StyleButton} from './SearchStyle'
import Select from 'react-select'
import axios from 'axios'



class Search extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            data : [],
            dataset: [],
            selectedDrug : 'Search for Drug'
        }
        this.handleDrugChange = this.handleDrugChange.bind(this)
        this.handleDatasetChange = this.handleDatasetChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.redirectUser = this.redirectUser.bind(this)
    }

    axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        }
    };

    componentDidMount() {
        axios.get(`http://localhost:5000/api/v1/dataset`)
            .then((response) => {
                    const dataset = response.data.data.map(item => ({
                            value: item.dataset_id,
                            label: item.dataset_name
                    }))
                    this.setState ({
                    dataset: [...dataset]
                })
            })
    }

    handleDrugChange = selectedOption => {
        if (selectedOption !== null && selectedOption.length > 0) {
            const label = selectedOption[0].label
            this.setState ({
                selectedDrug : label
            })
        }
    }

    handleDatasetChange = selectedOption => {
        const label = selectedOption.value
        let initial = 1;
        axios.post(`http://localhost:5000/api/v1/drug/dataset`, {label}, this.axiosConfig)
             .then((response) => {
                console.log(response)
                const data = response.data.data.map(item => ({
                    value: initial++,
                    label: item.drug
                }))
                this.setState ({
                    data: [...data]
                })
             })
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
           this.redirectUser()
        }
    }

    redirectUser = () => {
        const { history } = this.props
        history.push(`/drug/${this.state.selectedDrug}`)
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
                                    options={this.state.dataset} 
                                    styles={customStyles}
                                    placeholder={'Select the Dataset'}
                                    onChange={this.handleDatasetChange}
                                />
                            </div>
                            <div className='div-drug'>
                                <Select 
                                    closeMenuOnSelect={false}
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
                                styles={customStyles}
                                placeholder={'Genomics'}
                            />
                        </div>

                        <div className='div-gene'>
                            <Select 
                                styles={customStyles}
                                placeholder={'Search for Gene'}
                            />
                        </div>
                        <StyleButton onClick={this.redirectUser} type='button'> 
                            <span>
                                Search
                            </span>
                        </StyleButton>
                    </div>
                </div>
            </StyleBar>
        )
    }
}


export default withRouter(Search)