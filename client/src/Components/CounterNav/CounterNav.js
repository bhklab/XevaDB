import React, { Fragment } from 'react'
import CountUp from 'react-countup'
import { Link } from 'react-router-dom'
import DonutNav from './CounterStyle'
import axios from 'axios'
import GlobalStyles from '../../GlobalStyles'
import TopNav from '../TopNav/TopNav'

class CounterNav extends React.Component {

    constructor(props) {
        super(props)
        // setting states for all the variables.
        this.state = {
            drugs: 0,
            patients: 0,
            datasets: 6,
            tissues: 0
        }
    }

    componentDidMount() {
        axios.get(`/api/v1/counter`)
            .then(response => {
                this.setState({
                    tissues: response.data.data[0][0]['tissues'],
                    drugs: response.data.data[1][0]['drugs'],
                    patients: response.data.data[2][0]['patients']
                })
            })
    }


    render() {
        return (
            <Fragment>
                <TopNav/>
                <GlobalStyles/>
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
            </Fragment>
        )
    }

}

export default CounterNav