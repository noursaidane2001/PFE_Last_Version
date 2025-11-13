import './App.css';
import React, { useEffect } from 'react';
import Nav from './Component/Nav/Nav';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Component/Home/Home';
import Tournaments from './Component/Tournaments/Tournaments';
import Videos from './Component/Videos/Videos.js';
import Login from './Component/Login/Login';
import Sign from './Component/Sign/Sign';
import Forgotpass from './Component/Forgotpass/Forgotpass';
import Resetpass from './Component/Resetpass/Resetpass';
import Profile from './Component/Profile/Profile';
import CreateTournement from './Component/CreateTournement/CreateTournement';
import TourProfile from './Component/TourProfile/TourProfile';
import Admintest from './Component/Admin/Admintest';
import Manageusers from './Component/Admin/Manageusers';
import Footer from './Component/Footer/Footer';
import SignConfirm from './Component/Sign/SignConfirm';
import Games from './Component/Games/Games';
import isLoggedin from './Component/isLoggedin/isLoggedin';
import Reclamation from './Component/Reclamation/Reclamation';
import CreateLive from './Component/CreateLive/CreateLive';
import Live from './Component/Live/Live';
// import Search from '../src/Component/Nav/Search';
import Search from '../src/Component/Nav/Search';
import Getusers from './Component/Getusers/Getusers';
import Chat from './Component/LiveRoom/ChatLive';
import Chatting from './Component/testingchat/chatt';
import Liveroom from './Component/Live/Liveroom';
import Searchuser from './Component/Searchuser/Searchuser';
import Slider from './Component/Live/Slider/Slider';

function App() {

  const isLogged = isLoggedin();
  console.log("isLogged", isLogged);

  if (isLogged) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log(token);
    console.log(user);

  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/sign" element={<><Nav/><Sign/></>} />
        <Route path="/user/login" element={<><Nav/><Login /></>} />
        <Route path="/user/forgot-password" element={<><Nav/><Forgotpass /></>} />
        <Route path="/user/reset-password/:id/:token" element={<><Nav/><Resetpass /></>} />
        <Route path="/user/signupconfirm/:id" element={<><Nav/><SignConfirm /></>} />
        <Route path="/chat" element={<><Nav/><Chat/></>}/>
        <Route path="/dashboard" element={<><Nav/><Admintest /></>} />
        <Route path='/games' element={<><Nav/><Games/></>} />
        <Route path="/home" element={<><Nav/><Home /></>} />
        <Route path="/tournaments" element={<><Nav/><Tournaments /></>}/>
        <Route path="tournaments/:id" element={<><Nav/><TourProfile /></>}/>
        <Route path="/Createtournament" element={<><Nav/><CreateTournement /></>}/>
        <Route path="/videos" element={<><Nav/><Videos /></>} />
        <Route path="/reclamation" element={<><Nav/><Reclamation /></>} />
        <Route path="/profile/:userId" element={<><Nav/><Profile /></>} />
        <Route path="/createlive" element={<><Nav/><CreateLive /></>} />
        <Route path="/live" element={<><Nav/><Live /></>} />
        <Route path="/search" element={<><Nav/><Searchuser /></>} />
        <Route path="/chatting" element={<><Nav/><Chatting/></>} />
        <Route path="/live/:id" element={<><Nav/><Liveroom/></>} />
        {/* <Route path="/chattournament/:id" element={<><Nav/><ChatHistTour/></>} />
        <Route path="/chatlive/:id" element={<><Nav/><ChatHistLive/></>} /> */}
        {/* slidertest */}
        <Route path="/slider" element={<><Nav/><Slider/></>} />

      </Routes>
    </BrowserRouter >
  );
}
export default App;