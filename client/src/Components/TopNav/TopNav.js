import React from 'react'
import { Link } from 'react-router-dom'
import {HeaderStyle, LogoStyle, LinkStyle} from './NavStyle'
import logo from '../../images/logo.png';
import Button from '@material-ui/core/Button'

class TopNav extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLogged : 'Login',
            isLink : '/login'
        }
    }

    componentWillMount() {
        localStorage.getItem('user') 
        ? this.setState({isLogged : 'Logout', isLink : '/'}) 
        : this.setState({isLogged : 'Login'})
    }

    isLoggedIn = (event) => {
        if(this.state.isLogged === 'Logout') {
            localStorage.removeItem('user')
            this.setState({isLogged : 'Login', isLink : '/login'})
        }
    }

    render() {
        return (
            <HeaderStyle>
                <Link to='/'>
                    <LogoStyle src={logo} alt='logo' />
                </Link>
                <LinkStyle>
                    <Link to='/'> Home </Link>
                    <Link to='/datasets'> Datasets </Link>
                    <Link to='/drugs'> Drugs </Link>
                    <Link to='/tissues'> Tissues </Link>
                    <Link to='/doc'> Documentation </Link>
                    <Link to={`${this.state.isLink}`}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.isLoggedIn}
                        >
                            {this.state.isLogged}
                        </Button>
                    </Link> 
                </LinkStyle>  
            </HeaderStyle>
        )
    }
}



export default TopNav