/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MainConatiner,
    TopNavContainer,
    LogoNavLinksContainer,
    ButtonStyle,
	MobileNavLinksContainer
} from './NavStyle';
import logo from '../../images/logo-latest.png';
import Drawer from '@material-ui/core/Drawer';
import burger from '../../images/burger.png';


// all the top nav links
 const LINKS = [
	{name: 'Home', to: '/'},
	// {name: 'Biomarker', to: '/biomarker'},
	{name: 'Datasets', to: '/datasets'},
	{name: 'Drugs', to: '/drugs'},
	{name: 'Patients', to: '/patients'},
	{name: 'Tissues', to: '/tissues'},
	{name: 'Documentation', to: '/doc'}
	// {name: 'Response', to: 'response'}
];

/**
 * @returns {component} - TopNav component
 */
function TopNav() {
    const [isLoggedIn, updateLoggedInState] = useState('Login');
    const [isLink, updateIsLink] = useState('/login');
	const [drawerOpen, setDrawerOpen] = useState(false)

	const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

	useEffect(() => {
		const handler = () => setIsMobile(window.innerWidth <= 900);
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);

    useEffect(() => {
        localStorage.getItem('user')
            ? updateLoggedInState('Logout')
            : updateLoggedInState('Login');
    }, []);

    function isUserLoggedIn() {
        if (isLoggedIn === 'Logout') {
            localStorage.removeItem('user');
            updateLoggedInState('Login');
            updateIsLink('/login');
        }
    }

	const links = () => {
		return (
			LINKS.map((link, index) => (
				<div className='nav-link' key={index}>
					<Link to={link.to}> {link.name} </Link>
				</div>
			))
		)
	}
	const mobileLinks = () => {
		return (
			LINKS.map((link, index) => (
				<div className='mobile-nav-link' key={index}>
					<Link to={link.to}> {link.name} </Link>
				</div>
			))
		)
	}

    return (
        <MainConatiner>
            <TopNavContainer>
                <LogoNavLinksContainer>

                    {isMobile ? (
						<button className='hamburger' onClick={() => setDrawerOpen(true)}>
							<img src={burger} />
						</button>
					) : (
						<>
							<div className='logo'>
								<Link to='/'>
									<img src={logo} alt='logo' />
								</Link>
							</div>
							<div className='nav-links-container'>
								{links()}
							</div>
						</>
					)}
					<Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
						<div className='mobile-nav-links-container' style={{color: "green"}}>
							<MobileNavLinksContainer>
							{mobileLinks()}

							</MobileNavLinksContainer>
						</div>
					</Drawer>
                </LogoNavLinksContainer>
                <ButtonStyle>
                    <Link to={isLink}>
                        <button
                            type='button'
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
