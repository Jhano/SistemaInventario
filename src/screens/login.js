import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import history from '../history';
import  {GoogleLogin} from 'react-google-login';
import {GoogleLogout} from 'react-google-login';




function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [validated, setValidated] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
  

    e.preventDefault();
      const settings = {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, password})//values: {email, password}
      };

      try {
          const fetchResponse = await fetch('http://localhost:3000/login', settings);
          const data = await fetchResponse.json();
          //{ok, err}
          if(data.ok){
            //  localStorage.setItem('loggeado', true);
            // sessionStorage.setItem('token', x.token):
    
            history.push('/asignatura');
            window.location.reload();
            setValidated(true);
            
          }else{
              setValidated(false);
              setError(data.err.message);
          }
      } catch (e) {
          return console.log(e);
      }    
     
  }

  const handleInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.id;
    console.log(value);
    
    if(name === 'email'){
        setEmail(value)
    }else{
      setPassword(value)
    }
  }

  const responseGoogle = async (googleUser) => {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    const settings = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({id_token})//values: {email, password}
      
    };
    try {
      const fetchResponse = await fetch('http://localhost:3000/google', settings);
      const data = await fetchResponse.json();
      if(data.ok){
          history.push('/asignatura');
          window.location.reload();
            setValidated(true);
      }else{
        setValidated(false);
        setError(data.err.message);
      }
      
    } catch (e) {
       return console.log(e);
    }
    
    
  }

  const signOut = () => {
    console.log("LOGOUT CORRECTO");
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => {handleInputChange(e)}}
            autoFocus
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
            onChange={(e) => {handleInputChange(e)}}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
         
          <GoogleLogin
              clientId="397255333013-4mqndh7dkaf62kg45d7m5lto2inf2hg5.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
          />
           <GoogleLogout
              clientId="397255333013-4mqndh7dkaf62kg45d7m5lto2inf2hg5.apps.googleusercontent.com"
              buttonText="Logout"
              onLogoutSuccess={signOut}
            >
            </GoogleLogout>
          {validated ? <></> : <Alert severity="error">{error}</Alert> }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => {handleSubmit(e)}}
          >
            Sign In
          </Button>
              
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

