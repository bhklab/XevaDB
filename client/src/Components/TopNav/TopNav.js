import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderStyle = styled.header`

    *{
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    .flex-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        min-height: 8vh;
        font-family: 'Raleway', sans-serif;
        background-color: #f6eeee;
    }

    .logo a {
        font-size: 26px !important; 
    }

    .nav-links {
        display: flex;
        justify-content: space-around;
        width: 50%
    }

    .nav-links > a, .logo a {
        color: #bd0808;
        text-decoration: none;
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 18px;
    }

`

class Header extends React.Component {
    
    render() {
        return (
            <HeaderStyle>
                <div className='flex-container'>
                    <div className='logo'> 
                        <Link to='/'> XevaDB </Link> 
                    </div>
                    <div className='nav-links'>
                        <Link to='/'> Home </Link>
                        <Link to='/maps'> HeatMap </Link>
                        <Link to='/curve'> Growth </Link>
                        <Link to='/donut_tissue'> TissueDonut </Link>
                        <Link to='/donut_drug'> DrugDonut </Link>
                    </div>
                </div>
           </HeaderStyle>
            
        )
    }

}

export default Header;