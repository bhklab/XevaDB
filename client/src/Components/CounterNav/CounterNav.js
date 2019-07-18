import React from 'react'
import CountUp from 'react-countup'
import DonutNav from './CounterStyle'
import axios from 'axios'


class CounterNav extends React.Component {

    constructor(props) {
        super(props)
        // setting states for all the variables.
        this.state = {
            drugs: 0,
            patients: 0,
            models: 0,
            datasets: 0,
            tissues: 0
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/api/v1/counter`)
            .then(response => {
                this.setState({
                   drugs: response.data.data[0]['drug'],
                   patients: response.data.data[0]['patient'],
                   models: response.data.data[0]['model'],
                   tissues: response.data.data[0]['tissue']
                })
            })
    }


    render() {
        return (
            <DonutNav>

                <div>
                    <CountUp 
                        start = {0}
                        end = {this.state.drugs}
                        duration = {3}
                    /> 
                    <h4> DRUGS </h4>
                </div>

                <div>
                    <CountUp 
                        start = {0}
                        end = {this.state.patients} 
                        duration = {3}
                    />
                    <h4> PATIENTS </h4> 
                </div>

                <div>
                    <CountUp 
                        start = {0}
                        end = {this.state.tissues} 
                        duration = {3}
                    />
                    <h4> TISSUES </h4>
                </div>

                <div>
                    <CountUp 
                        start = {0}
                        end = {this.state.models} 
                        duration = {3}
                    />
                    <h4> MODELS </h4>
                </div>

            </DonutNav>
        )
    }

}

export default CounterNav