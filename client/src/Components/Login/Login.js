import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Paper, FormStyle, SubmitStyle} from './LoginStyle'


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username : '',
      password : ''
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }


  handleUserChange = (event) => {
    console.log(event.target.value)
    this.setState({
      username: event.target.value
    })
  }


  handlePasswordChange = (event) => {
    console.log(event.target.value)
    this.setState({
      username: event.target.password
    })
  }

  handleSubmit = (event) => {
    
  }


  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Paper>

          <Typography component="h1" variant="h5" style={{color:'#3f51b5'}}>
            Sign in
          </Typography>

          <FormStyle>
            <form noValidate>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                name="username"
                autoFocus
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
              
              <Grid container style={{marginTop: '5px'}}>
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
          </FormStyle>

        </Paper>
      </Container>
    )
  }

}


export default Login