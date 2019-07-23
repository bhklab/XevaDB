import React from 'react'
import TopNav from '../TopNav/TopNav'
import DonutDrug from '../DonutChart/DonutDrugs'
import DonutTissue from '../DonutChart/DonutTissues'
import DonutPatient from '../DonutChart/DonutPatient'
import Search from '../Search/Search'
import CounterNav from '../CounterNav/CounterNav'
import Container from './HomeStyle'


class Home extends React.Component {
    render() {
        return (
            <Container>
                <TopNav/>
                <Search/>
                <div className='chart'>
                    <div><DonutTissue/></div>
                    <div><DonutDrug/></div> 
                    <div><DonutPatient/></div>
                </div>
                <CounterNav/>
            </Container>
               

        )
    }
}


export default Home