import React from 'react';


const styles = {
	color: '#0e8a83',
	fontSize: 18, 
	textAlign: 'center',
    paddingTop: '30px',
    minHeight: '60px',
    backgroundColor: "#fafcfc",
    fontFamily: 'Raleway',
};


class Footer extends React.Component {
    render() {
        return (
            <div style={styles}>
                ©BHKLab 2019
            </div>
        )
    }
}



export default Footer