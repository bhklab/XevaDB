import React from 'react';


const styles = {
	color: '#3453b0',
	fontSize: 18, 
	textAlign: 'center',
    paddingTop: '30px',
    minHeight: '50px',
    backgroundColor: "rgb(255,255,255,0.8)",
    fontFamily: 'sans-serif',
   
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