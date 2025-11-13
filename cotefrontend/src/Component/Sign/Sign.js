import * as React from 'react';
import '../Sign/Sign.css'
import axios from 'axios';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, NavLink } from 'react-router-dom';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withScrollToTop from '../withScrollToTop';
import inscrit from '../img/inscrit.PNG'
import { SignPost } from '../../Services/UserService';

function Sign() {
  /*****alert mui*****/
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  /*****alert mui*****/
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [values, setValues] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const validateForm = (values) => {
    const error = {};
    const gmail = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstname) {
      error.firstname = "First Name is required";
    }

    if (!values.lastname) {
      error.lastname = "Last Name is required";
    }

    if (!values.email) {
      error.email = "Email is required";
    } else if (!gmail.test(values.email)) {
      error.email = "Format not valid!";
    }

    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 6) {
      error.password = "Password must be at least 6 characters";
    } else if (!/^[A-Z]/.test(values.password)) {
      error.password = "Password must start with a capital letter";
    } else if (!/\d/.test(values.password)) {
      error.password = "Password must contain at least one number";
    }

    if (!values.confirmpassword) {
      error.confirmpassword = "Confirm Password is required";
    } else if (values.confirmpassword !== values.password) {
      error.confirmpassword = "Confirm password and password should be same";
    }

    return error;
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const isValid = () => {
    if (values.email === "") {
      return false;
    }
    return true;
  };
  const handleclick = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(values));
    setIsSubmit(true);
  };
  /***envoi des données par axios***/
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const post = {
        firstname: values.firstname,
        lastname: values.lastname,
        password: values.password,
        email: values.email,
      };
      console.log(post);
      SignPost(post)
        .then((response) => {
          if (response.errors) {
            if (response.errors.email === "You are already registred login to your account") {
              console.log("echec user exist deja");
              Swal.fire({
                title: "User email already registred ",
                icon: "error",
                confirmButtonText: "Signup again",
                showCancelButton: false
              });
            }
          }
          else {
            console.log("reussit");
            Swal.fire({
              title: "Check your email to confirm account ",
              icon: "success",
              // confirmButtonText: "Go login",
              showCancelButton: false
            });
          }
        }
        )
        .catch((error) => {
          console.log("SignPost does not work")

        });
    }
  }, [formErrors]);


  return (
    <div className='SignForm'>
      <div className='imgsign'>
        <img src={inscrit} alt="login Image" />
        <div className="join"><br /> Join us!</div>
      </div>

      <div className='FormS'>
        <div className='SAL'>
          <div className='Su'>Sign Up</div>
          <div className='AL' >
            <div className='A'>Already member ?</div>
            <NavLink to="/user/login" className='LS'>
              login
            </NavLink>
          </div>
        </div>

        {/*****************formulaire****************/}
        <div className='sForm'>
          <FormControl required sx={{ m: 1, width: '52ch' }} variant="outlined">
            <InputLabel htmlFor="name"
            >First Name</InputLabel>
            <OutlinedInput
              name="firstname"
              onChange={handleChange}
              value={values.firstname}
              id="firstname"
              label="First Name"
              sx={{
                '& fieldset': {
                  borderColor: '#FFFFFF80',

                },
              }}
              style={{ color: '#ffffff' }}

            />
            <Stack >
              {formErrors.firstname && (
                <Alert severity="error">{formErrors.firstname}</Alert>
              )}
            </Stack>
          </FormControl>

          <FormControl required sx={{ m: 1, width: '28rem' }} variant="outlined">
            <InputLabel htmlFor="lastname">Last Name</InputLabel>
            <OutlinedInput
              name="lastname"
              onChange={handleChange}
              value={values.lastname}
              id="lastname"
              label="Last Name"
              sx={{
                '& fieldset': {
                  borderColor: '#FFFFFF80',
                },
              }}
              style={{ color: '#ffffff' }}
            />
            <Stack>
              {formErrors.lastname && (
                <Alert severity="error">{formErrors.lastname}</Alert>
              )}
            </Stack>


          </FormControl>
          {/* </div> */}
          <FormControl required sx={{ m: 1, width: '28rem' }} variant="outlined">
            <InputLabel htmlFor="email" >Email</InputLabel>
            <OutlinedInput
              name="email"
              onChange={handleChange}
              value={values.email}
              id="email"
              label="Email"
              sx={{
                '& fieldset': {
                  borderColor: '#FFFFFF80',
                },
              }}
              style={{ color: '#ffffff' }}
            />
            <Stack >
              {formErrors.email && (
                <Alert severity="error">{formErrors.email}</Alert>
              )}
            </Stack>

          </FormControl>

          <FormControl required sx={{ m: 1, width: '28rem' }} variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              name="password"
              onChange={handleChange}
              value={values.password}
              id="password"
              label="Password"
              sx={{
                '& fieldset': {
                  borderColor: '#FFFFFF80',
                },
              }}
              style={{ color: '#ffffff' }}

              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    style={{ color: "rgb(159, 156, 156)" }}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Stack>
              {formErrors.password && (
                <Alert severity="error">{formErrors.password}</Alert>
              )}
            </Stack>

          </FormControl>

          <FormControl required sx={{ m: 1, width: '52ch' }} variant="outlined">
            <InputLabel htmlFor="confirmpassword">Confirm Password</InputLabel>
            <OutlinedInput
              name="confirmpassword"
              onChange={handleChange}
              value={values.confirmpassword}
              id="confirmpassword"
              label="Confirm Password"
              sx={{
                '& fieldset': {
                  borderColor: '#FFFFFF80',
                },
              }}
              style={{ color: '#ffffff' }}

              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    style={{ color: "rgb(159, 156, 156)" }}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Stack>
              {formErrors.confirmpassword && (
                <Alert severity="error">{formErrors.confirmpassword}</Alert>
              )}
            </Stack>

          </FormControl>
          <div onClick={handleclick} >
            <Button disabled={isValid() ? false : true}
              className='btnSign'
              name='button' type='submit'
              onClick={handleclick}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>

  );
}
export default withScrollToTop(Sign);
