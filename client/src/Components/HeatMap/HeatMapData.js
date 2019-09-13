import React from 'react'
import HeatMap from './HeatMap'
import axios from 'axios'


class HeatMapData extends React.Component {

    constructor(props) {
        super(props)
        //setting the states for the data.
        this.state = {
            data : [],
            patient_id : [],
            drug_id : [],
            dataset_param : 0
        };
        //binding the functions declared.
        this.parseData = this.parseData.bind(this);
    }

    // this function takes the parsed result and set the states.
    parseData(result) {
        console.log(result)
        let dataset = []
        let patient = []
        let drug = []

        //patient array.
        patient = result.pop()

        dataset = result.map((data) => {
            console.log(patient)
            drug.push(data.Drug)
            //removing the Drug entry.
            delete data.Drug
            return data
        })

        this.setState({
            drug_id : drug,
            patient_id : patient,
            data: dataset
        })
    }

    componentWillMount() {
        this.setState ({
            dataset_param : this.props.dataset
        })
    }

    componentDidMount() {
        if(this.state.dataset_param > 0) {
            axios.get(`http://localhost:5000/api/v1/response/${this.state.dataset_param}`)
             .then(response => {
                 this.parseData(response.data);
             })
        } else {
            axios.get(`http://localhost:5000/api/v1/respeval`)
            .then(response => {
                this.parseData(response.data);
            })
        }
    }


    dimensions = {
        height: 35,
        width: 20,
    }

    margin = {
        top: 200,
        right: 200,
        bottom: 20,
        left: 250
    }

    
    
    render() {
        return (
            <div className="wrapper" style={{margin:"auto", fontSize:"0"}}>
                <HeatMap
                    data = {this.state.data} 
                    drug_id = {this.state.drug_id} 
                    className = "heatmap"
                    patient_id = {this.state.patient_id} 
                    dimensions = {this.dimensions}
                    margin = {this.margin}
                />
            </div>
        )
    }
}

export default HeatMapData