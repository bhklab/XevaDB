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
            drug_id : []
        };
        //binding the functions declared.
        this.parseData= this.parseData.bind(this);
    }

    // this function takes the parsed result and set the states.
    parseData(result) {
        const dataset = result;
        let patient = Object.keys(dataset[0]);
        patient.shift();
        let drug = dataset.map((data) => {
            return data.Drug;
        })
        this.setState({
            drug_id : drug,
            patient_id : patient,
            data: dataset
        })
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/api/v1/respeval`)
             .then(response => {
                 this.parseData(response.data);
             })
    }

    render() {
        return (
            <div>
                <HeatMap
                    data={this.state.data} drug_id={this.state.drug_id} 
                    patient_id={this.state.patient_id}
                />
            </div>
        )
    }
}

export default HeatMapData