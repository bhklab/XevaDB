import React from 'react';


const styles = {
    color: '#3453b0',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: '30px',
    minHeight: '50px',
    bottom: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    minWidth: '100vw',
    backgroundColor: 'rgb(255,255,255,0.8)',
    fontFamily: 'Raleway, sans-serif',

};


const Footer = () => (
    <div style={styles}>
        ©BHKLab 2019
    </div>
);

export default Footer;
