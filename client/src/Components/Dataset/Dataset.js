import React, {Fragment} from 'react'
import HeatMapData from '../HeatMap/HeatMapData'
import OncoprintData from '../Oncoprint/OncoprintData'
import Footer from '../Footer/Footer'

class Dataset extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataset : 0
        }
    }

    componentWillMount() {
        let dataset_param = this.props.match.params.id
        this.setState ({
            dataset: dataset_param
        })
    }

    render() {
        return (
            <Fragment>
                <HeatMapData  
                    dataset = {this.state.dataset}
                />
                <OncoprintData
                    dataset = {this.state.dataset}
                />
                <Footer/>
            </Fragment>
        )
    }
}



export default Dataset