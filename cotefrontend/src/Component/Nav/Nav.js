import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import "./Nav.css";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import logo from "../img/logo.png";
import { NavLink, Link } from "react-router-dom";
import Home from "../Home/Home";
import Tournaments from "../Tournaments/Tournaments";
import Videos from "../Videos/Videos";
import Games from "../Games/Games";
import Search from "./Search";
import isLoggedin from "../isLoggedin/isLoggedin";
import Live from "../Live/Live";
import streamicon from "../img/stream.png";
import { LiveTv, LiveTvOutlined } from "@mui/icons-material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { getUser } from "../../Services/UserService";

const pages = ["Home", "Tournaments", "Live", "Games"];
const settings = ["Profile", "My tournaments", "My Livestreams", "Log out"];
const admin = ["Dashboard", "Profile", "Log out"];

function Nav() {
  //userid
  const token = localStorage.getItem("token");
  console.log("token", token);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const isAdmin = user?.isAdmin;
  //donnees user connecte
  const [data, setData] = useState([]);
  useEffect(() => {
    getUser(userId).then((response) => {
      setData(response);
    });
  }, [userId]);
  console.log(data);
  //logout
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate(`/home`, { replace: true });
  };

  const isLogged = isLoggedin();
  console.log("isLogged", isLogged);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  //admin
  const handleAdminItemClick = (adminItem) => {
    switch (adminItem) {
      case "Dashboard":
        navigate(`/dashboard`);
        handleCloseUserMenu();
        break;
      case "Profile":
        localStorage.setItem("clickState", "profile");
        navigate(`/profile/${userId}`);
        window.location.reload();
        handleCloseUserMenu();
        break;
      case "Log out":
        handleLogout();
        handleCloseUserMenu();
        break;
      default:
        break;
    }
  };
  //settings user
  const handleSettingClick = (setting) => {
    switch (setting) {
      case "Profile":
        localStorage.setItem("clickState", "profile");
        navigate(`/profile/${userId}`);
        window.location.reload();
        handleCloseUserMenu();
        break;
      case "My tournaments":
        localStorage.setItem("clickState", "tournaments");
        navigate(`/profile/${userId}`);
        window.location.reload();
        handleCloseUserMenu();
        break;
      case "My Livestreams":
        localStorage.setItem("clickState", "livestreams");
        navigate(`/profile/${userId}`);
        window.location.reload();
        handleCloseUserMenu();
        break;
      case "Log out":
        handleLogout();
        handleCloseUserMenu();
        break;
      default:
        break;
    }
  };

  //style de dot vert
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "red",
      color: "red",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '"live"',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  return (
    <AppBar position="static" className="app-bar">
      <Toolbar disableGutters>
        {isLogged ? (
          <Link to="/tournaments">
            <img className="logo" src={logo} alt="estream logo" />
          </Link>
        ) : (
          <Link to="/home">
            <img className="logo" src={logo} alt="estream logo" />
          </Link>
        )}
        <Box className="box-menu">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {isLogged
              ? pages.slice(1).map((page, index) => (
                  <NavLink
                    style={{ textDecoration: "none" }}
                    to={`/${page.toLowerCase().replaceAll(/\s/g, "-")}`}
                    key={index}
                  >
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center" className="menu-btn">
                        {page}
                      </Typography>
                    </MenuItem>
                  </NavLink>
                ))
              : pages.map((page, index) => (
                  <NavLink
                    style={{ textDecoration: "none" }}
                    to={`/${page.toLowerCase().replaceAll(/\s/g, "-")}`}
                    key={index}
                  >
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center" className="menu-btn">
                        {page}
                      </Typography>
                    </MenuItem>
                  </NavLink>
                ))}
          </Menu>
        </Box>
        {isLogged ? (
          <Box className="comp-box">
            {pages.slice(1).map((page, index) => {
              let component;
              switch (page) {
                case "tournaments":
                  component = <Tournaments />;
                  break;
                case "Live":
                  component = <Live />;
                  break;
                case "games":
                  component = <Games />;
                  break;
                default:
                  component = null;
              }
              return (
                <NavLink
                  style={{ textDecoration: "none" }}
                  to={`/${page.toLowerCase().replaceAll(/\s/g, "-")}`}
                  key={index}
                >
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    className="button-style"
                  >
                    {page}
                  </Button>
                </NavLink>
              );
            })}
          </Box>
        ) : (
          <Box className="comp-box">
            {pages.map((page, index) => {
              let component;
              switch (page) {
                case "home":
                  component = <Home />;
                  break;
                case "tournaments":
                  component = <Tournaments />;
                  break;
                case "Live":
                  component = <Live />;
                  break;
                case "games":
                  component = <Games />;
                  break;
                default:
                  component = null;
              }
              return (
                <NavLink
                  style={{ textDecoration: "none" }}
                  to={`/${page.toLowerCase().replaceAll(/\s/g, "-")}`}
                  key={index}
                >
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    className="button-style"
                  >
                    {page}
                  </Button>
                </NavLink>
              );
            })}
          </Box>
        )}
        {isLogged ? (
          <Box display="flex" alignItems="center">
            {isAdmin ? <></> : <Search />}

            {/* live */}
            {isAdmin ? (
              <></>
            ) : (
              <Stack direction="row" className="av">
                <Link
                  to="/createlive"
                  style={{ textDecoration: "none", color: "#343beb" }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    variant="dot"
                  >
                    <img
                      src={`${streamicon}`}
                      alt="streamicon"
                      className="streamicon"
                    />
                  </StyledBadge>
                </Link>
              </Stack>
            )}

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip className="tool">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={`${data.firstname} ${data.lastname}`}
                    src={`http://localhost:5000/uploads/user/${data.photo}`}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <div className="NAMECard">
                  <img
                    src={`http://localhost:5000/uploads/user/${data.photo}`}
                    alt={`${data.firstname} ${data.lastname}`}
                    className="pp"
                  />
                  <div className="CARDname">{data.firstname}</div>
                  <div className="CARDlastname">{data.lastname}</div>
                </div>
                {isAdmin
                  ? admin.map((adminItem, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleAdminItemClick(adminItem)}
                      >
                        {adminItem === "Log out" && (
                          <Typography textAlign="center" style={{ flex: "1" }}>
                            <LogoutIcon style={{ marginLeft: "1.2rem" }} />
                            {adminItem}
                          </Typography>
                        )}
                        {adminItem !== "Log out" && (
                          <Typography textAlign="center">
                            {adminItem}
                          </Typography>
                        )}
                      </MenuItem>
                    ))
                  : settings.map((setting, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleSettingClick(setting)}
                      >
                        {setting === "Log out" && (
                          <Typography textAlign="center" style={{ flex: "1" }}>
                            <LogoutIcon style={{ marginLeft: "1.2rem" }} />
                            {setting}
                          </Typography>
                        )}
                        {setting !== "Log out" && (
                          <Typography textAlign="center">{setting}</Typography>
                        )}
                      </MenuItem>
                    ))}
              </Menu>
            </Box>
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            <NavLink to="/user/login" style={{ textDecoration: "none" }}>
              <Button className="log-btn">Login</Button>
            </NavLink>
            <NavLink to="/user/sign" style={{ textDecoration: "none" }}>
              <Button className="sign-btn">Signup</Button>
            </NavLink>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Nav;
