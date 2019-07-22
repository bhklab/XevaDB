import React from 'react'
import TopNav from '../TopNav/TopNav'
import DonutDrug from '../DonutChart/DonutDrugs'
import DonutTissue from '../DonutChart/DonutTissues'
import DonutPatient from '../DonutChart/DonutPatient'
import Search from '../Search/Search'
import CounterNav from '../CounterNav/CounterNav'
import styled from 'styled-components'



const DonutNav = styled.div`
    display: flex;
    margin-top: 15vh;
    justify-content: space-around;
`;


const Content = styled.div`
    margin-top: 30vh;
    margin-bottom: 10vh;
`;


class Home extends React.Component {
    render() {
        return (
            <div>
                <TopNav/>
                <Content>
                    <Search/>
                    <DonutNav>
                        <div><DonutTissue/></div>
                        <div><DonutDrug/></div> 
                        <div><DonutPatient/></div>
                    </DonutNav>
                </Content>
                <CounterNav/>
            </div>
        )
    }
}

export default Home