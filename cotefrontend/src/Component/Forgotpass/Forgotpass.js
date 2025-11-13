import * as React from 'react';
import '../Forgotpass/Forgotpass.css';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, Link } from 'react-router-dom';
import {Grid, CssBaseline, Button} from '@material-ui/core';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withScrollToTop from '../withScrollToTop';
import { ForgotPass } from '../../Services/UserService';

const token = localStorage.getItem("token");
console.log("token", token);
function Forgotpass() {
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
        email: "",
    });
    const validateForm = (values) => {
        const error = {};
        const gmail = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
            error.email = "Email is required";
        } else if (!gmail.test(values.email)) {
            error.email = "Format not valid!";
        }
        return error;
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

    /***envoi des données par axios ***/
    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const post = {
                email: values.email,
            };
            console.log(post);
           ForgotPass(post,token)
                .then((response) => {
                    console.log("user found", response);
                    // navigate("/user/reset-password", { replace: true });
                    Swal.fire({
                        title: "email sended successfully",
                        icon: "success",
                        showCancelButton: false
                    });
                })
                .catch((error) => {
                    console.log("user not found", error);
                    if (error.message == "user is not signed up before") {
                        console.log("user is not signed up before");
                        Swal.fire({
                          title: "user is not signed up before",
                          icon: "error",
                          showCancelButton: false
                        });
                      }
                 
                });
        }
    }, [formErrors]);


    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh", backgroundColor: "#161616" }}
        >
            <CssBaseline />
            <Grid container direction="column" spacing={2} sx={{ width: '50%' }}>
                <Grid item >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
                        <h1
                            style={{
                                margin: 0,
                                color: "#FFFFFF",
                                fontFamily: "Mulish, sans-serif",
                                fontWeight: 200,
                                fontSize: 60,
                                marginBottom: 80,
                                letterSpacing: "2px"

                            }}
                        >
                            Email Validation

                        </h1>
                    </div>
                </Grid>
            </Grid>
            {/*****************formulaire****************/}

            <FormControl required sx={{ m: 1, width: '52ch' }} variant="outlined">
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
                <Stack spacing={2} sx={{ width: '100%' }}>
                    {formErrors.email && (
                        <Alert severity="error">{formErrors.email}</Alert>
                    )}
                </Stack>

            </FormControl>

            {/* reload page   */}
            <FormControl sx={{ width: '52ch' }}>
                <Link style={{ textDecoration: "none", color: "#343beb", }} to={'/user/forgot-password'}
                    onClick={() => window.location.reload()}>
                    Didn't receive an email ?</Link>
            </FormControl>


            <div onClick={handleclick}>
                <Button disabled={isValid() ? false : true}
                    name='button' type='submit'
                    style={{
                        backgroundColor: '#343beb',
                        borderRadius: "50px",
                        letterSpacing: "3px",
                        marginTop: '50px',
                        width: "200px",
                    }}
                    onClick={handleclick}
                >
                    Send
                </Button>
            </div>

        </Grid>



    );
}
export default withScrollToTop(Forgotpass);
