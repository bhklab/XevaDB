import React, { Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import {Paper, SubmitStyle, LogoStyle, PaperGradient, LogoBack} from './LoginStyle'
import logo from '../../images/logo.png'
import axios from 'axios'


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username : '',
      password : '',
      isAuthenticated : false
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
    }
  };

  handleUserChange = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    axios.post(`/api/v1/login`, {
      username: this.state.username,
      password: this.state.password
    })
    .then((response) => {
      localStorage.setItem('user', response.headers['auth-token'])
      this.setState ({
        isAuthenticated : this.isAuthenticated()
      })
    })
    .catch((error) => {
      console.log(error, 'Authentication Failed')
    })
  }

  isAuthenticated() {
    const token = localStorage.getItem('user')
    return token && token.length > 10
  }


  render() {
    return (
      <Fragment>
      { this.state.isAuthenticated ? <Redirect to ={{pathname: '/'}}/> : (
        <Fragment>
          <Link to='/'>
            <LogoBack>
              <LogoStyle src={logo} alt='logo' />
            </LogoBack>
          </Link>

          <Container component="main" maxWidth="xs">
            <PaperGradient>
            <Paper>

              <Typography component="h1" variant="h5" style={{color:'#3f51b5', marginTop: '4.5vh'}}>
                Sign in
              </Typography>

              <form onSubmit={this.handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Username"
                  name="username"
                  onChange={this.handleUserChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.handlePasswordChange}
                />

                <SubmitStyle>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign In
                </Button>
                </SubmitStyle>
                
                <Grid container style={{marginTop: '15px'}}>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </form>

            </Paper>
            </PaperGradient>
          </Container>
        </Fragment>
      )}
      </Fragment>
    )
  }

}


export default Login
