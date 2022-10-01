/* eslint-disable no-unused-expressions */
import React from 'react';
import { Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import {
    MainConatiner,
    TopNavContainer,
    LogoNavLinksContainer,
    ButtonStyle,
} from './NavStyle';
import logo from '../../images/logo-latest.png';

// all the top nav links
// const LINKS = ['', 'biomarker', 'datasets', 'drugs', 'patients', 'tissues', 'doc'];

/**
 *
 * @returns {component} - TopNav component
 */
function TopNav() {
    const { keycloak } = useKeycloak();
    const username = keycloak?.idTokenParsed?.preferred_username;
    const token = keycloak?.authenticated && keycloak?.token;
    window.accessToken = token;

    return (
        <MainConatiner>
            <TopNavContainer>
                <LogoNavLinksContainer>
                    <div className="logo">
                        <Link to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                    </div>
                    <div className="nav-links-container">
                        <div className="nav-link">
                            <Link to="/"> Home </Link>
                        </div>
                        <div className="nav-link">
                            <Link to="/biomarker"> Biomarker </Link>
                        </div>
                        <div className="nav-link">
                            <Link to="/datasets"> Datasets </Link>
                        </div>
                        <div className="nav-link">
                            <Link to="/drugs"> Drugs </Link>
                        </div>
                        <div className="nav-link">
                            <Link to="/patients"> Patients </Link>
                        </div>
                        <div className="nav-link">
                            <Link to="/tissues"> Tissues </Link>
                        </div>
                        <div className="nav-link">
                            <Link to="/doc"> Documentation </Link>
                        </div>
                    </div>
                </LogoNavLinksContainer>
                <ButtonStyle>
                    {
                        !keycloak.authenticated && (
                            <button
                                type="button"
                                onClick={() => keycloak.login()}
                            >
                                <span className="button-text-login"> Login </span>
                            </button>
                        )
                    }

                    {
                        !!keycloak.authenticated && (
                            <button
                                type="button"
                                onClick={() => keycloak.logout()}
                            >
                                <span className="button-text-logout">
                                    {' '}
                                    Logout (
                                    {username}
                                    )
                                    {' '}
                                </span>
                            </button>
                        )
                    }
                </ButtonStyle>
            </TopNavContainer>
        </MainConatiner>
    );
}

export default TopNav;
