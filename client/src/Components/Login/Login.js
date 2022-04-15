/* eslint-disable class-methods-use-this */
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import {
    Paper, SubmitStyle, LogoStyle, PaperGradient, LogoBack,
} from './LoginStyle';
import logo from '../../images/new_logo.png';
import colors from '../../styles/colors';


// axios configuration
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
    },
};

// main login functional component
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, updateAuthenticationValue] = useState(false);

    // update the username
    const handleUserChange = (event) => {
        setUsername(event.target.value);
    }

    // update password state
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    // function to handle submit
    const handleSubmit = (event) => {
        // prevent the default behaviour.
        event.preventDefault();

        // post request.
        axios.post('/api/v1/login', {
            username,
            password,
        }, axiosConfig.headers)
            .then((response) => {
                localStorage.setItem('user', response.headers['auth-token']);
                updateAuthenticationValue(isUserAuthenticated());
            })
            .catch((error) => {
                // console.log(error, 'authentication failed');
                alert('Authentication Failed, Please Enter a valid Password and Username');
            });
    }

    // checks if the user is authenticated or not?
    const isUserAuthenticated = () => {
        const token = localStorage.getItem('user');
        return token && token.length > 10;
    }

    return (
        <div>
            {isAuthenticated ? <Redirect to={{ pathname: '/' }} /> : (
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
                                    color: `${colors.blue_header}`, marginTop: '4.5vh', fontWeight: '700', fontSize: '30px',
                                }}
                            >
                                Sign in
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Username"
                                    name="username"
                                    onChange={handleUserChange}
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
                                    onChange={handlePasswordChange}
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
                                        <Link to="#" variant="body2">
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


export default Login;