import React from 'react'
import CountUp from 'react-countup'
import { Link } from 'react-router-dom'
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
            datasets: 1,
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

                <Link>
                    <CountUp 
                        start = {0}
                        end = {this.state.datasets} 
                        duration = {3}
                        useEasing={true}
                    />
                    <h4> DATASETS </h4>
                </Link>


                <Link to='/tissues'>
                    <CountUp 
                        start = {0}
                        end = {this.state.tissues} 
                        duration = {3}
                        useEasing={true}
                    />
                    <h4> TISSUES </h4>
                </Link>


                 <Link>
                    <CountUp 
                        start = {0}
                        end = {this.state.patients} 
                        duration = {3}
                        useEasing={true}
                    />
                    <h4> PATIENTS </h4> 
                </Link>


                <Link to='/drugs'>
                    <CountUp 
                        start = {0}
                        end = {this.state.drugs}
                        duration = {3}
                        useEasing={true}
                    /> 
                    <h4> DRUGS </h4>
                </Link>
                    

            </DonutNav>
        )
    }

}

export default CounterNav