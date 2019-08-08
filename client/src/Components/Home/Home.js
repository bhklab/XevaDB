import React from 'react'
import Search from '../Search/Search'
import CounterNav from '../CounterNav/CounterNav'
import Container from './HomeStyle'



class Home extends React.Component {
    constructor(props) {
        super(props)
    }
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