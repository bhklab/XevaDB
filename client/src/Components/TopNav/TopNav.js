import React from 'react'
import { Link } from 'react-router-dom'
import {HeaderStyle, LogoStyle, LinkStyle} from './NavStyle'
import logo from '../../images/logo.png';

class TopNav extends React.Component {
    render() {
        return (
            <HeaderStyle>
                <Link to='/'>
                    <LogoStyle src={logo} alt='logo' />
                </Link>
                <LinkStyle>
                    <Link to='/'> Home </Link>
                    <Link to='/datasets'> Datasets </Link>
                    <Link to='/drugs'> Drugs </Link>
                    <Link to='/tissues'> Tissues </Link>
                    <Link to='/doc'> Documentation </Link>
                </LinkStyle>         
            </HeaderStyle>
        )
    }
}



export default TopNav