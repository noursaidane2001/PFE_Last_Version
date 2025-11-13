import React from 'react';
import './Home.css';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import Hello from './Hellosignup';
import Aboutus from './Aboutus';
import Test from './Test';
import withScrollToTop from '../withScrollToTop';
function Home(){
    return(
        //<h1>home page</h1>
        // <div className="App">
        //     {/* <img src={test0} /> */}
        //     <img
        //       src={test0}
        //       alt="nature"
        //       style={{
        //         position: 'absolute',
        //         left: 0,
        //         right: 0,
        //         height: '100%',
        //         width: '100%',
        //         objectFit: 'cover',
        //       }}
        //     />
        // </div>
        // <div className="App" style={{backgroundImage: `url(${test0})` }}>
        // <div className="App-content">
        //     <h1>The best place to </h1><h1>play and enjoy.</h1>
        //     <p>Join us
        //     <NavLink to="/user/sign" style={{ textDecoration: "none" }} >
        //       <Button  sx={{ borderRadius: '20px', color: 'white', backgroundColor: '#343beb', marginLeft: "50px" }}>
        //         Signup
        //       </Button>
        //     </NavLink>
        //     </p>
        // </div>
        // </div>
        <>
        <Hello/>
        <div className="horizontal-line"></div>
        <Aboutus/>
        <div className="horizontal-line"></div>
        {/* <Test></Test> */}
        </>
    );
}
export default withScrollToTop(Home);