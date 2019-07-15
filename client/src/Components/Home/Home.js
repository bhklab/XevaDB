import React from 'react'
import TopNav from '../TopNav/TopNav'
import DonutDrug from '../DonutChart/DonutDrugs'
import DonutTissue from '../DonutChart/DonutTissues'
import Search from '../Search/Search'
import styled from 'styled-components'


const DonutNav = styled.div`
    display: flex;
`;


class Home extends React.Component {
    render() {
        return (
            <div>
                <TopNav/>
                <Search/>
                <DonutNav>
                    <div><DonutDrug/></div> 
                    <div><DonutTissue/></div>
                </DonutNav>
            </div>
        )
    }
}

export default Home