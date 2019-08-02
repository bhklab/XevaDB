import React from 'react'
import { withRouter } from 'react-router-dom';
import {StyleBar, customStyles} from './SearchStyle'
import Select from 'react-select'
import axios from 'axios'


class Search extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            data : [],
            selectedDrug : 'Search for Drug'
        }
        this.handleDrugChange = this.handleDrugChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentDidMount() {
        let values = [];
        let initial = 1;
        axios.get(`http://localhost:5000/api/v1/alldrugs`)
             .then((response) => {
                 response.data.data.forEach(item => {
                     values.push(
                         {  
                            value: initial++,
                            label: item.drug
                         }
                     )
                 })
                 this.setState ({
                    data: values
                })
             })
    }

    handleDrugChange = selectedOption => {
        const label = selectedOption.label
        this.setState ({
            selectedDrug : label
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
            <StyleBar className="wrapper">
                <div className="search-container">
                    
                    <div className='select-component' onKeyPress={this.handleKeyPress}>
                    <h1> <span>XevaDB:</span> A Database For PDX Pharmacogenomic Data </h1>

                        <div className="two-col">
                            <div className="div-1">
                                <Select 
                                    styles={customStyles}
                                    placeholder={'Select the Dataset'}
                                />
                            </div>
                            <div className="div-2">
                                <Select 
                                    options={this.state.data} 
                                    styles={customStyles}
                                    placeholder={'Search for Drug (eg. CLR457)'}
                                    onChange={this.handleDrugChange}
                                />
                            </div>
                        </div>
                        
                        <div className="div-3"> 
                            <Select 
                                styles={customStyles}
                                placeholder={'Genomics'}
                            />
                        </div>
                        <div className="div-4">
                            <Select 
                                styles={customStyles}
                                placeholder={'Search for Gene'}
                            />
                        </div>
                    </div>
                </div>
            </StyleBar>
           
        )
    }
}


export default withRouter(Search)