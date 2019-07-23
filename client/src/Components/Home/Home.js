import React from 'react'
import TopNav from '../TopNav/TopNav'
import DonutDrug from '../DonutChart/DonutDrugs'
import DonutTissue from '../DonutChart/DonutTissues'
import DonutPatient from '../DonutChart/DonutPatient'
import Search from '../Search/Search'
import CounterNav from '../CounterNav/CounterNav'
import styled from 'styled-components'



const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  .chart {
    display: flex;
    flex: 1;
    justify-content: space-around;
    margin-top: 20vh;
    width: 100%;
    margin-bottom: 80px;
  }

    @media screen and (max-width: 1300px) {
        .chart {
            justify-content: space-between;
        }
    }

    @media screen and (max-height: 950px) {
        .chart {
            margin-top: 5vh;
        }
    }
`

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