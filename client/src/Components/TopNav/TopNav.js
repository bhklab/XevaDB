import React from 'react'
import { Link } from 'react-router-dom'
import {HeaderStyle, LogoStyle, LinkStyle} from './NavStyle'

class TopNav extends React.Component {
    render() {
        return (
            <HeaderStyle>
                <LogoStyle>
                    <Link to='/'> <h3> XevaDB</h3> </Link> 
                </LogoStyle>
                <LinkStyle>
                    <Link to='/'> Home </Link>
                    <Link to='/maps'> HeatMap </Link>
                    <Link to='/drug'> Drugs </Link>
                    <Link to='/tissue'> Tissues </Link>
                    <Link to='/doc'> Documentation </Link>
                </LinkStyle>         
            </HeaderStyle>
        )
    }
}



export default TopNav