import React from 'react'
import HeatMap from '../HeatMap/HeatMap'
import axios from 'axios'
import TopNav from '../TopNav/TopNav'
import OncoprintData from '../Oncoprint/OncoprintData'
import Footer from '../Footer/Footer'

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
        const dataset = result;
        let patient = Object.keys(dataset[0]);
        patient.shift();
        let drug = dataset.map((data) => {
            return data.Drug;
        })
        //console.log(drug)
        //console.log(patient)
        this.setState({
            drug_id : drug,
            patient_id : patient,
            data: dataset
        })
    }

    // grab the query parameters passed to this component.
    getParams() {
        // grabbing the parameters
        let params = new URLSearchParams(this.props.location.search);
        let drug_param = params.get('drug')
        //console.log(drug_param)
        return drug_param;
    }

    componentDidMount() {
        let drug_param = this.getParams()
        axios.get(`http://localhost:5000/api/v1/respevaldrug/?drug=${drug_param}`)
             .then(response => {
                 this.parseData(response.data);
             })
    }

    dimensions = {
        height: 35,
        width: 20,
    }

    margin = {
        top: 300,
        right: 200,
        bottom: 0,
        left: 250
    }

    render() {
        return (
            <div>
                <TopNav/>
                <HeatMap
                    data={this.state.data} drug_id={this.state.drug_id} 
                    patient_id={this.state.patient_id} dimensions={this.dimensions}
                    margin={this.margin}
                />
                <OncoprintData/>
                <Footer/>
            </div>
        )
    }
}




export default Drug