import React from 'react';
import Search from '../Search/Search';
import CounterNav from '../CounterNav/CounterNav';
import Container from './HomeStyle';

const Home = () => (
    <Container>
        <Search />
        <CounterNav />
    </Container>
);

export default Home;
