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
            <StyleBar>
                <h1> XevaDB: A Database For PDX Pharmacogenomic Data </h1>
                <div className='select-component' onKeyPress={this.handleKeyPress}>
                    <Select 
                        options={this.state.data} 
                        styles={customStyles}
                        placeholder={'Search for Drug (eg. CLR457)'}
                        onChange={this.handleDrugChange}
                    />
                </div>
            </StyleBar>
           
        )
    }
}


export default withRouter(Search)