import React from 'react';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DonutNav from './CounterStyle';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';

class CounterNav extends React.Component {
    constructor(props) {
        super(props);
        // setting states for all the variables.
        this.state = {
            drugs: 0,
            patients: 0,
            datasets: 6,
            tissues: 0,
            models: 0,
        };
    }

    componentDidMount() {
        axios.get('/api/v1/counter')
            .then((response) => {
                this.setState({
                    tissues: response.data.data[0][0].tissues,
                    drugs: response.data.data[1][0].drugs,
                    patients: response.data.data[2][0].patients,
                    models: response.data.data[3][0].models,
                });
            });
    }


    render() {
        const {
            datasets, tissues, patients, drugs, models,
        } = this.state;
        return (
            <div>
                <TopNav />
                <GlobalStyles />
                <DonutNav>
                    <Link to="/datasets">
                        <CountUp
                            start={0}
                            end={datasets}
                            duration={3}
                            useEasing
                        />
                        <h4> DATASETS </h4>
                    </Link>
                    <Link to="/tissues">
                        <CountUp
                            start={0}
                            end={tissues}
                            duration={3}
                            useEasing
                        />
                        <h4> TISSUES </h4>
                    </Link>
                    <Link to="/">
                        <CountUp
                            start={0}
                            end={patients}
                            duration={3}
                            useEasing
                        />
                        <h4> PATIENTS </h4>
                    </Link>
                    <Link to="/">
                        <CountUp
                            start={0}
                            end={models}
                            duration={3}
                            useEasing
                        />
                        <h4> MODELS </h4>
                    </Link>
                    <Link to="/drugs">
                        <CountUp
                            start={0}
                            end={drugs}
                            duration={3}
                            useEasing
                        />
                        <h4> DRUGS </h4>
                    </Link>
                </DonutNav>
            </div>
        );
    }
}

export default CounterNav;
