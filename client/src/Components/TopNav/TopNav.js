/* eslint-disable no-unused-expressions */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { HeaderStyle, LogoStyle } from './NavStyle';
import logo from '../../images/new_logo.png';

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
                <div className='logo'>
                    <Link to="/">
                        {/* <LogoStyle src={logo} alt="logo" /> */}
                    </Link>
                </div>
                <div className='nav-links'>
                    <Link to="/biomarker"> Biomarker </Link>
                    <Link to="/datasets"> Datasets </Link>
                    <Link to="/drugs"> Drugs </Link>
                    <Link to="/patients"> Patients </Link>
                    <Link to="/tissues"> Tissues </Link>
                    <Link to="/doc"> Documentation </Link>
                </div>
                <div className='login-button'>
                    <Link to={`${isLink}`}>
                        <button
                            onClick={this.isLoggedIn}
                        >
                            {isLogged}
                        </button>
                    </Link>
                </div>
            </HeaderStyle>
        );
    }
}

export default TopNav;
