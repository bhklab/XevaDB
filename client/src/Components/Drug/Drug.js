import React from 'react'
import HeatMap from '../HeatMap/HeatMap'
import axios from 'axios'


class Drug extends React.Component {

    constructor(props) {
        super(props)
        
        //setting the states for the data.
        this.state = {
            data : [],
            patient_id : [],
            drug_id : [],
        };

        //binding the functions declared.
        this.parseData= this.parseData.bind(this);
    }

    // this function takes the parsed result and set the states.
    parseData(result) {

        let patient = Object.keys(result);
        patient.shift();
        let drug = [];
        const entries = Object.entries(result)
        entries.forEach(element => {
            if(element[0] === 'Drug') {
                drug.push(element[1]);
            }
        });
        let dataset = [];
        dataset.push(result)
        this.setState({
            drug_id : drug,
            patient_id : patient,
            data: dataset
        })
        
    }

    componentDidMount() {
        let id = this.props.match.params.id
        axios.get(`http://localhost:5000/api/v1/respevaldrug/${id}`)
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

export default Drug