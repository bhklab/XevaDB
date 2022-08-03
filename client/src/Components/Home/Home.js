import React from 'react';
import Search from '../Search/Search';
import CounterNav from '../CounterNav/CounterNav';
import Container from './HomeStyle';
import GlobalStyles from '../../GlobalStyles';

const Home = () => (
    <Container>
        <GlobalStyles />
        <Search />
        <CounterNav />
    </Container>
);

export default Home;
