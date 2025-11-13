import React from 'react';
import test0 from '../img/test0.PNG';
//import './Home.css';
import './Hellosignup.css';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
function Hellosignup(){
    return(

        <div className="Apphello" style={{backgroundImage: `url(${test0})`}}>
        <div className="App-contenthello">
            <h1 className='hello'>The best place</h1>
            <h1 className='hello22'>  to play and enjoy</h1>
            <p className='para' >Join us now !
            <NavLink to="/user/sign" style={{ textDecoration: "none" }} >
              <Button className='sUp' sx={{ width:'17rem',borderRadius: '8rem', color: 'white', backgroundColor: '#343beb', marginLeft: "50px",fontSize: "0.8em",}}>
                Sign Up
              </Button>
            </NavLink>
            </p>
        </div>
        </div>
    );
}
export default Hellosignup;