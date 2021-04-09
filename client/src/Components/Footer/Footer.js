import React from 'react';
import colors from '../../styles/colors';


const styles = {
    color: `${colors.blue_header}`,
    fontSize: '1.20em',
    textAlign: 'center',
    paddingTop: '30px',
    minHeight: '50px',
    bottom: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    minWidth: '100vw',
    backgroundColor: `${colors.white_red}`,
    fontFamily: 'Raleway, sans-serif',
};


const Footer = () => (
    <div style={styles}>
        ©BHKLab 2019
    </div>
);

export default Footer;
