/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MainConatiner,
    TopNavContainer,
    LogoNavLinksContainer,
    ButtonStyle,
} from './NavStyle';
import logo from '../../images/new_logo.png';

// all the top nav links
const LINKS = ['', 'biomarker', 'datasets', 'drugs', 'patients', 'tissues', 'doc'];

/**
 * 
 * @returns {component} - TopNav component
 */
const TopNav = function () {
    const [isLoggedIn, updateLoggedInState] = useState('Login');
    const [isLink, updateIsLink] = useState('/login');
    const [selectedLink, updateSelectedLink] = useState('');

    useEffect(() => {
        localStorage.getItem('user')
            ? updateLoggedInState('Logout')
            : updateLoggedInState('Login');
    }, [])

    function update() {
        const page = window.location.href.split('/').at(-1);
        const doesPageMatchLinks = LINKS.includes(page);

        if (!doesPageMatchLinks && selectedLink) selectedLink.className = '';
    }
    update();

    function isUserLoggedIn() {
        if (isLoggedIn === 'Logout') {
            localStorage.removeItem('user');
            updateLoggedInState('Login');
            updateIsLink('/login');
        }
    }

    function addSelectedClassToLink(event) {
        if (event.target.tagName !== 'A') return;

        // if there is already a selection, remove the selected class from it
        if (selectedLink) selectedLink.className = '';

        // add selected class to the new selection and update the state
        event.target.className = 'selected';
        updateSelectedLink(event.target);
    }

    return (
        <MainConatiner>
            <TopNavContainer>
                <LogoNavLinksContainer>
                    <div className='logo'>
                        <Link to="/">
                            {/* <img src={logo} alt="logo" /> */}
                        </Link>
                    </div>
                    <div className='nav-links-container' onClick={event => addSelectedClassToLink(event)}>
                        <div className='nav-link'>
                            <Link to="/"> Home </Link>
                        </div>
                        <div className='nav-link'>
                            <Link to="/biomarker"> Biomarker </Link>
                        </div>
                        <div className='nav-link'>
                            <Link to="/datasets"> Datasets </Link>
                        </div>
                        <div className='nav-link'>
                            <Link to="/drugs"> Drugs </Link>
                        </div>
                        <div className='nav-link'>
                            <Link to="/patients"> Patients </Link>
                        </div>
                        <div className='nav-link'>
                            <Link to="/tissues"> Tissues </Link>
                        </div>
                        <div className='nav-link'>
                            <Link to="/doc"> Documentation </Link>
                        </div>
                    </div>
                </LogoNavLinksContainer>
                <ButtonStyle>
                    <Link to={`${isLink}`}>
                        <button
                            onClick={isUserLoggedIn}
                        >
                            {isLoggedIn}
                        </button>
                    </Link>
                </ButtonStyle>
            </TopNavContainer>
        </MainConatiner>
    );
}

export default TopNav;
