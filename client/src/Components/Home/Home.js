import React from 'react'
import TopNav from '../TopNav/TopNav'
import DonutDrug from '../DonutChart/DonutDrugs'
import DonutTissue from '../DonutChart/DonutTissues'
import DonutPatient from '../DonutChart/DonutPatient'
import Search from '../Search/Search'
import CounterNav from '../CounterNav/CounterNav'
import styled from 'styled-components'



const DonutNav = styled.div`
    .donutnav {
        display: flex;
        width: 100%;
    }
`;


class Home extends React.Component {
    render() {
        return (
            <div>
                <TopNav/>
                <Search/>
                <DonutNav>
                    <div className='donutnav'>
                        <div><DonutTissue/></div>
                        <div><DonutDrug/></div> 
                        <div><DonutPatient/></div>
                    </div>
                </DonutNav>
                <CounterNav/>
            </div>
        )
    }
}

export default Home