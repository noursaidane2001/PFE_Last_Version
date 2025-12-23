import * as React from "react";
import "../Login/Login.css";
import axios from "axios";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, NavLink, Link, useParams } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withScrollToTop from "../withScrollToTop";
import inscrit from "../img/inscrit.PNG";
import { LoginPost } from "../../Services/UserService";

function Login() {
  
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });

  const validateForm = (values) => {
    const error = {};
    const gmail = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!gmail.test(values.email)) {
      error.email = "Format not valid!";
    }
    if (!values.password) {
      error.password = "Password is required";
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
    return values.email !== "" && values.password !== "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(values));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const post = {
        email: values.email,
        password: values.password,
      };
      console.log(post);
      LoginPost(post)
        .then((response) => {
          if (response.errors) {
            if (response.errors.email === "email not registered") {
              Swal.fire({
                title: "Email not already registered!",
                icon: "error",
                confirmButtonText: "Signup Now!",
                showCancelButton: false,
              });
              navigate(`/user/sign`, { replace: true });
            }
            if (response.errors.password === "incorrect password") {
              Swal.fire({
                title: "Incorrect password!",
                icon: "error",
                confirmButtonText: "Re-enter password",
                showCancelButton: false,
              });
            }
            if (response.errors.email === "email not verified") {
              Swal.fire({
                title: "Check your email and validate your email!",
                icon: "error",
                showCancelButton: false,
              });
            }
            if (response.errors.email === "email blocked") {
              Swal.fire({
                title: "Check your email, you are blocked. Contact admin!",
                icon: "error",
                showCancelButton: false,
              });
            }
          } else {
            const userId = response.user._id;
            console.log("User ID:", userId);
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            const token = localStorage.getItem("token");
            console.log("token", token);
            console.log(response.user.isAdmin);
            if (response.user.isAdmin === true) {
              navigate("/dashboard");
            } else {
              navigate("/tournaments");
            }
          }
        })
        .catch((error) => {
          console.log("LoginPost does not work", error);
          Swal.fire({
            title: "Login failed",
            text: "An error occurred during login. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  }, [formErrors, isSubmit]);

  return (
    <div className="loginForm">
      <div className="imglogin">
        <img src={inscrit} alt="Login illustration" />
        <div className="wlc">
          <br />
          Welcome Again !
        </div>
      </div>
      <div className="Form">
        <div className="LSN">
          <div className="L">Login</div>
          <div className="NS">
            <div className="N">Not a member ?</div>
            <NavLink to="/user/sign" className="S">
              Signup
            </NavLink>
          </div>
        </div>
        {/*****************formulaire****************/}
        <form onSubmit={handleSubmit}>
          <div className="EPForm">
            <FormControl
              required
              sx={{ m: 1, width: "28rem" }}
              variant="outlined"
            >
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                name="email"
                onChange={handleChange}
                value={values.email}
                id="email"
                label="Email"
                sx={{
                  "& fieldset": {
                    borderColor: "#FFFFFF80",
                  },
                }}
                style={{ color: "#ffffff" }}
              />
              <Stack>
                {formErrors.email && (
                  <Alert severity="error">{formErrors.email}</Alert>
                )}
              </Stack>
            </FormControl>
            <FormControl
              required
              sx={{ m: 1, width: "28rem" }}
              variant="outlined"
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                name="password"
                onChange={handleChange}
                value={values.password}
                id="password"
                label="Password"
                sx={{
                  "& fieldset": {
                    borderColor: "#FFFFFF80",
                  },
                }}
                style={{ color: "#ffffff" }}
                type={showPassword ? "text" : "password"}
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
            <Link
              style={{
                textDecoration: "none",
                color: "#343beb",
                fontFamily: "'PT Sans', sans-serif",
                marginLeft: "0.6rem",
              }}
              to={"/user/forgot-password"}
            >
              Forgot Password ?
            </Link>
          </div>
          <Button
            disabled={!isValid()}
            className="btnLogin"
            name="button"
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
export default withScrollToTop(Login);
