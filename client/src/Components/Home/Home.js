import React from 'react'
import Search from '../Search/Search'
import CounterNav from '../CounterNav/CounterNav'
import Container from './HomeStyle'



class Home extends React.Component {
    render() {
        return (
            <Container>
                <Search/>
                <CounterNav/>
            </Container>
        )
    }
}


export default Home