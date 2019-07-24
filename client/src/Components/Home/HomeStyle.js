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
            margin-top: 2.5vh;
        }
    }
`


export default Container