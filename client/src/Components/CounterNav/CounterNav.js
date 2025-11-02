import React from 'react';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CounterStyle from './CounterStyle';

class CounterNav extends React.Component {
    constructor(props) {
        super(props);
        // setting states for all the variables.
        this.state = {
            drugs: 0,
            patients: 0,
            datasets: 0,
            tissues: 0,
            models: 0,
            types: ['datasets', 'tissues', 'patients', 'models', 'drugs'],
        };
    }

    componentDidMount() {
        axios.get('/api/v1/counter', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                this.setState({
                    tissues: response.data.data[0][0].tissues,
                    drugs: response.data.data[1][0].drugs,
                    patients: response.data.data[2][0].patients,
                    models: response.data.data[3][0].models,
                    datasets: response.data.data[4][0].datasets,
                });
            });
    }

    render() {
        const { types } = this.state;
        // console.log(types)

        return (
            <div>
                <CounterStyle>
                    {
                        types.map((type, i) => (
                            type === 'models' ? (
                                <Link disable to={type} key={i}   onClick={(e) => { e.preventDefault(); }}>
                                    <div className='count'>
                                        <CountUp
                                            start={0}
                                            end={this.state[type]}
                                            duration={3}
                                            useEasing
                                        />
                                    </div>
                                    <div>
                                        {type.toUpperCase()}
                                    </div>
                                </Link>
                             ) : (
                                <Link to={type} key={i}>
                                    <div className='count'>
                                        <CountUp
                                            start={0}
                                            end={this.state[type]}
                                            duration={3}
                                            useEasing
                                        />
                                    </div>
                                    <div>
                                        {type.toUpperCase()}
                                    </div>
                                </Link>
                             )
                        ))
                    }
                </CounterStyle>
            </div>
        );
    }
}

export default CounterNav;
