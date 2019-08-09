import React, {Fragment} from 'react'
import HeatMapData from '../HeatMap/HeatMapData'
import OncoprintData from '../Oncoprint/OncoprintData'
import Footer from '../Footer/Footer'

class Dataset extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Fragment>
                <HeatMapData/>
                <OncoprintData/>
                <Footer/>
            </Fragment>
        )
    }
}



export default Dataset