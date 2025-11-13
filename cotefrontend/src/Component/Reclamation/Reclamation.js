import * as React from 'react';
import '../Login/Login.css';
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
import { useNavigate, NavLink, Link, useParams } from 'react-router-dom';
import {Grid, CssBaseline, Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';
import loginimg from '../img/inscrit.PNG';
import withScrollToTop from '../withScrollToTop';

const token = localStorage.getItem("token");
console.log("token", token);

function Reclamation(){
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
    iduserreclaming:"",
    iduserdoingreclamation: "",
    reclamationbody: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleclick = (e) => {
    e.preventDefault();
    setIsSubmit(true);
  };
  //recuperer les donnees d'url
  /***envoi des données par axios ***/
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const post = {
        iduserreclaming: values.iduserreclaming,
        iduserdoingreclamation: values.iduserdoingreclamation,
        reclamationbody:values.reclamationbody
      };
      console.log(post);
      axios.post("http://localhost:5000/createreclamation", post, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    })
        .then((response) => {
          if (response.status === 200)
            Swal.fire({
              title: "Reclamation sended successfully",
              icon: "success",
              showCancelButton: false
            });
          navigate(`/home`, { replace: true });
        })
        .catch((error) => {
          Swal.fire({
            title: "Please review your answer.",
            icon: "error",
            showCancelButton: true
          });
          // console.log(error.response.data);
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
      style={{ minHeight: "150vh", maxWidth: "100vw", backgroundColor: "#161616" ,}}
      className='testing'
    >
    <FormControl required sx={{ m: 1, width: '52ch' }} variant="outlined">
    <InputLabel htmlFor=" iduserdoingreclamation" > iduserdoingreclamation</InputLabel>
    <OutlinedInput
      name=" iduserdoingreclamation"
      onChange={handleChange}
      value={values.iduserdoingreclamation}
      id="iduserdoingreclamation"
      label="iduserdoingreclamation"
      sx={{
        '& fieldset': {
          borderColor: '#FFFFFF80',
        },
      }}
      style={{ color: '#ffffff' }}
    />

  </FormControl>
  <FormControl required sx={{ m: 1, width: '52ch' }} variant="outlined">
    <InputLabel htmlFor=" iduserreclaming" > iduserreclaming</InputLabel>
    <OutlinedInput
      name=" iduserreclaming"
      onChange={handleChange}
      value={values.iduserreclaming}
      id="iduserreclaming"
      label="iduserreclaming"
      sx={{
        '& fieldset': {
          borderColor: '#FFFFFF80',
        },
      }}
      style={{ color: '#ffffff' }}
    />

  </FormControl>
  <FormControl required sx={{ m: 1, width: '52ch' }} variant="outlined">
    <InputLabel htmlFor="reclamationbody">reclamationbody</InputLabel>
    <OutlinedInput
      name="reclamationbody"
      onChange={handleChange}
      value={values.reclamationbody}
      id="reclamationbody"
      label="reclamationbody"
      sx={{
        '& fieldset': {
          borderColor: '#FFFFFF80',
        },
      }}
    />

  </FormControl>
  </Grid>)
}
export default  withScrollToTop(Reclamation);