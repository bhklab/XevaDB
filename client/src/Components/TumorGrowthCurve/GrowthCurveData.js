/* eslint-disable react/no-deprecated */
import React from 'react';
import TumorGrowthCurve from './TumorGrowthCurve';


class GrowthCurveData extends React.Component {
    constructor(props) {
        super(props);
        // setting states.
        this.state = {
            patientParam: '',
            drugParam: '',
        };
    }

    // get the parameters and set the values in the variables.
    componentWillMount() {
        const { location } = this.props;
        const params = new URLSearchParams(location.search);
        this.setState({
            patientParam: params.get('patient'),
            drugParam: params.get('drug'),
        });
    }

    render() {
        const { patientParam, drugParam } = this.state;
        return (
            <div>
                <TumorGrowthCurve
                    patientParam={patientParam}
                    drugParam={drugParam}
                />
            </div>
        );
    }
}


export default GrowthCurveData;
