import React, {Fragment} from 'react'
import HeatMap from './HeatMap'
import axios from 'axios'
import GlobalStyles from '../../GlobalStyles'
import TopNav from '../TopNav/TopNav'

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
        let dataset = []
        let patient = []
        let drug = []

        //patient array.
        patient = result.pop()
        
        // this function will loop through the elements and
        // assign empty values in case model information is not available.
        result.forEach(element => {
            let data_object = {}
            drug.push(element.Drug)
            patient.forEach((patient) => {
                if(!element[patient]) {
                    data_object[patient] = ''
                } else {
                    data_object[patient] = element[patient]
                }
            })
            dataset.push(data_object)
        });

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
            axios.get(`/api/v1/response/${this.state.dataset_param}`)
             .then(response => {
                 this.parseData(response.data);
             })
        } else {
            axios.get(`/api/v1/respeval`)
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
            <Fragment>
                <TopNav/>
                <GlobalStyles/>
                <div className='wrapper' style={{margin:'auto', fontSize:'0'}}>
                    <HeatMap
                        data = {this.state.data} 
                        drug_id = {this.state.drug_id} 
                        className = 'heatmap'
                        patient_id = {this.state.patient_id} 
                        dimensions = {this.dimensions}
                        margin = {this.margin}
                    />
                </div>
            </Fragment>
        )
    }
}

export default HeatMapData