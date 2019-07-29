import React from 'react';


const styles = {
	color: '#bd0808',
	fontSize: 18, 
	textAlign: 'center',
    paddingTop: '30px',
    minHeight: '60px',
    backgroundColor: "#f6eeee",
    fontFamily: 'Raleway',
};


class Footer extends React.Component {
    render() {
        return (
            <div style={styles}>
                ©Copyright 2019 BHKLab 
            </div>
        )
    }
}



export default Footer