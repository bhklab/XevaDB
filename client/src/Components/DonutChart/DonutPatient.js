import React from 'react'
import DonutChart from './DonutChart'
import axios from 'axios'

// ************ This code is not being used anywhere for now  ************//
class DonutPatient extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data : []
        }
    }

    componentDidMount() {
        let new_values = []
        const promise1 = axios.get(`/api/v1/getinboth`);
        const promise2 = axios.get(`/api/v1/getonlydrug`);
        const promise3 = axios.get(`/api/v1/getonlysequencing`);

        Promise.all([promise1, promise2, promise3])
             .then((response) => {
                let i = 1;
                response.forEach((data) => {
                    if(data.data.length !== 0) {
                        let value = {}
                        if (i===1) {
                            value['id'] = 'Sequence and Drug Data'
                        } else if (i===2) {
                            value['id'] = 'Only Drug Data'
                        } else if (i===3) {
                            value['id'] = 'Only Sequence Data'
                        }
                        i++;
                        value['value'] = data.data.length;
                        new_values.push(value)
                    }
                })
                this.setState({
                    data : new_values
                })
             })
    }

    dimensions = {
        width: 130,
        height: 80
    }

    margin = {
        top: 220,
        right: 100,
        bottom: 100,
        left: 250
    }

    arc = {
        outerRadius: 160,
        innerRadius: 70
    }

    chartId = 'donut_patient'

    render() {
        return (
            <div className='DonutPatient'>
                <DonutChart 
                    dimensions = {this.dimensions} 
                    margin = {this.margin} 
                    chartId = {this.chartId} 
                    data = {this.state.data}
                    arc = {this.arc}
                />
            </div>
        )
    }
}

export default DonutPatient