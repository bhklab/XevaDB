/* eslint-disable class-methods-use-this */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import {
    Paper, SubmitStyle, LogoStyle, PaperGradient, LogoBack,
} from './LoginStyle';
import logo from '../../images/logo.png';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isAuthenticated: false,
            axiosConfig: {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    Accept: 'application/json',
                },
            },
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }


    handleUserChange(event) {
        this.setState({
            username: event.target.value,
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value,
        });
    }

    handleSubmit(event) {
        // prevent the default behaviour.
        event.preventDefault();

        // destructuring the state.
        const { username, password, axiosConfig } = this.state;

        // post request.
        axios.post('/api/v1/login', {
            username,
            password,
        }, axiosConfig.headers)
            .then((response) => {
                localStorage.setItem('user', response.headers['auth-token']);
                this.setState({
                    isAuthenticated: this.isAuthenticated(),
                });
            })
            .catch((error) => {
                console.log(error, 'Authentication Failed');
            });
    }

    isAuthenticated() {
        const token = localStorage.getItem('user');
        return token && token.length > 10;
    }


    render() {
        const { isAuthenticated } = this.state;
        return (
            <div>
                { isAuthenticated ? <Redirect to={{ pathname: '/' }} /> : (
                    <div>
                        <Link to="/">
                            <LogoBack>
                                <LogoStyle src={logo} alt="logo" />
                            </LogoBack>
                        </Link>

                        <PaperGradient>
                            <Paper>

                                <Typography
                                    component="h1"
                                    variant="h5"
                                    style={{
                                        color: '#3f51b5', marginTop: '4.5vh', fontWeight: '700', fontSize: '30px',
                                    }}
                                >
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

                                    <Grid container style={{ marginTop: '15px' }}>
                                        <Grid item xs>
                                            <Link href="#" variant="body2">
                      Forgot password?
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </form>

                            </Paper>
                        </PaperGradient>

                    </div>
                )}
            </div>
        );
    }
}


export default Login;
