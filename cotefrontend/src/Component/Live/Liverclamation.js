import * as React from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, NavLink } from 'react-router-dom';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
    const token = localStorage.getItem("token");
    console.log("token", token);

 function Livereclamation(id){
    /***envoi des données par axios***/
    useEffect(() => {
            const post = new FormData();
            axios.post(`http://127.0.0.1:5000/reclamation/createreclamationLive/${id}`, post, {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            })
                .then((response) => {

                    // const tourId = response.data._id;
                    // console.log("reussit", tourId);
                    // navigate(`/tournaments/${tourId}`, { replace: true });


                })
                .catch((error) => {
                });
        }
  , []);
return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#161616", marginTop: "10vh" }}>
            <CssBaseline />
            <Grid container direction="column" spacing={2} sx={{ width: '50%' }}>
                <Grid item >
                <div className="mb-3">
                <label htmlFor="task-priority2" className="form-label">State</label>
                <select className="form-select form-control-light" id="task-priority2" name="state"  >
                    {/* onChange={onChangeHandler}>    */}
                 <option >rule Violations</option>
                  <option>technical Issues</option>
                  <option >streaming Quality</option>
                </select>
              </div>
                    <div >
                        <Button
                            name='button' type='submit'
                            style={{
                                backgroundColor: '#343beb',
                                borderRadius: "50px",
                                letterSpacing: "3px",
                                marginTop: '25vh',
                                width: "200px",
                                marginBottom: "1vh"
                            }}
                        >
                            add Tournement
                        </Button>
                    </div>

                </Grid>
            </Grid>
        </Grid>

    );
}

export default Livereclamation;