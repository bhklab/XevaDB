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
                    <Link to='/home'> Home </Link>
                    <Link to='/maps'> HeatMap </Link>
                    <Link to='/curve'> Growth </Link>
                    <Link to='/donut_tissue'> TissueDonut </Link>
                    <Link to='/donut_drug'> DrugDonut </Link>
                </LinkStyle>         
            </HeaderStyle>
        )
    }
}



export default TopNav