import React from 'react'
import StyleBar from './SearchStyle'
import Select from 'react-select'
import axios from 'axios'


class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data : []
        }
    }

    componentDidMount() {
        let values = [];
        let initial = 1;
        axios.get(`http://localhost:5000/api/v1/alldrugs`)
             .then((response) => {
                 console.log(response)
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
          
           console.log(values)
    }

    render() {
       
        return (
            <StyleBar>
                <h1> XevaDB: A Database For PDX Pharmacogenomic Data </h1>
                <Select options={this.state.data} />
            </StyleBar>
           
        )
    }
}

export default Search