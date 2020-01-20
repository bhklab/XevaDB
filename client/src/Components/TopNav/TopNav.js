/* eslint-disable react/no-deprecated */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-deprecated */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { HeaderStyle, LogoStyle, LinkStyle } from './NavStyle';
import logo from '../../images/logo.png';

class TopNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: 'Login',
            isLink: '/login',
        };
        this.isLoggedIn = this.isLoggedIn.bind(this);
    }

    static getDerivedStateFromProps() {
        let localState = '';
        localStorage.getItem('user')
            ? localState = ({ isLogged: 'Logout', isLink: '/login' })
            : localState = ({ isLogged: 'Login' });
        return localState;
    }

    isLoggedIn() {
        const { isLogged } = this.state;
        if (isLogged === 'Logout') {
            localStorage.removeItem('user');
            this.setState({ isLogged: 'Login', isLink: '/login' });
        }
    }

    render() {
        const { isLink, isLogged } = this.state;
        return (
            <HeaderStyle>
                <Link to="/">
                    <LogoStyle src={logo} alt="logo" />
                </Link>
                <LinkStyle>
                    <Link to="/"> Home </Link>
                    <Link to="/datasets"> Datasets </Link>
                    <Link to="/drugs"> Drugs </Link>
                    <Link to="/tissues"> Tissues </Link>
                    <Link to="/doc"> Documentation </Link>
                    <Link to={`${isLink}`}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.isLoggedIn}
                        >
                            {isLogged}
                        </Button>
                    </Link>
                </LinkStyle>
            </HeaderStyle>
        );
    }
}


export default TopNav;
