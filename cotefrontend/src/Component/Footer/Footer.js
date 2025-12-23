import * as React from "react";
import "./Footer.css";
import logo from "../img/logo.png";
import facebook from "../img/facebook.png";
import insta from "../img/instagram.png";
import youtube from "../img/youtube.png";
import discord from "../img/discord.png";
function Footer() {
  return (
    <div className="foot">
      <div className="fot">
        <img src={logo} className="logofoot" alt=""></img>
        <div className="middle">
          <h1 className="texte">Home Page</h1>
          <div className="verticale-line"></div>
          <h1 className="texte">Contact Us</h1>
          <div className="verticale-line"></div>
          <h1 className="texte">About Us</h1>
        </div>
        <div className="fott">
          <img src={logo} className="logofoot" alt="" />
          <img src={insta} className="social" alt="" />
          <img src={youtube} className="social" alt="" />
          <img src={discord} className="social" alt="" />
          <img src={facebook} className="social" alt="" />
        </div>
      </div>
    </div>
  );
}
export default Footer;
