import React from 'react';
import { Grid } from '@mui/material';
import '../Tournaments/Tournaments.css';
import tourimage from '../img/tourimage.PNG';
// import manetteicon from '../img/manetteicon.png';
// import participants from '../img/participants.png';
// import calendar from '../img/calendar.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Filtre from './Filtre';
import withScrollToTop from '../withScrollToTop';

function Tournaments() {

  return (
    
    <Grid container direction="row" justifyContent="center" className="grid1">
  <Grid container className="grid2" spacing={4}>
    <Grid item xs={12}>
      <div className="imgbg">
        <img src={tourimage} alt="Tournament Image" />
        <div className="txt">
          <br/><br/> <br/><br/><br/>Tournaments
        </div>
      </div>
      <Filtre/>
    </Grid>
  </Grid>
</Grid>


  );
}

export default withScrollToTop(Tournaments);