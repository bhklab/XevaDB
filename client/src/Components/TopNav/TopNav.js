/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MainConatiner,
    TopNavContainer,
    LogoNavLinksContainer,
    ButtonStyle,
} from './NavStyle';
import logo from '../../images/logo-latest.png';
import { useKeycloak } from "@react-keycloak/web";

// all the top nav links
const LINKS = ['', 'biomarker', 'datasets', 'drugs', 'patients', 'tissues', 'doc'];

/**
 * 
 * @returns {component} - TopNav component
 */
const TopNav = function () {
    const { keycloak } = useKeycloak();


    return (
        <MainConatiner>
            <TopNavContainer>
                <LogoNavLinksContainer>
                    <div className='logo'>
                        <Link to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                    </div>
                    <div className='nav-links-container'>
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
                    {
                        !keycloak.authenticated && (
                            <button
                                onClick={() => keycloak.login()}
                            >
                                Login
                            </button>
                        )
                    }

                    {
                        !!keycloak.authenticated && (
                            <button
                                onClick={() => keycloak.logout()}
                            >
                                Logout ({keycloak.tokenParsed.preferred_username})
                            </button>
                        )
                    }
                </ButtonStyle>
            </TopNavContainer>
        </MainConatiner>
    );
}

export default TopNav;
