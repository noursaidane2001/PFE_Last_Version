import React, { useEffect } from "react";
import "../Profilee/Profilee.css";
import { Grid } from "@mui/material";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
// import { Dialog } from 'primereact/dialog';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// import { Password } from 'primereact/password';
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";
import withScrollToTop from "../../withScrollToTop";
import { FaPencilAlt } from "react-icons/fa";
import {
  editUser,
  getUser,
  getUserFollowers,
  getUserFollowing,
} from "../../../Services/UserService";

function Profilee() {
  const token = localStorage.getItem("token");
  console.log("token", token);
  const { userId } = useParams();
  const [data, setData] = useState([]);
  //followers and following
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  useEffect(() => {
    getUserFollowing(userId).then((response) => {
      setFollowing(response.count);
    });

    getUserFollowers(userId).then((response) => {
      setFollowers(response.count);
    });
  }, [userId]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [scroll, setScroll] = React.useState("paper");

  //valeurs
  const [values, setValues] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  //passwords
  const [password, setPassword] = React.useState({
    currentpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  //gestion des erreurs
  const [formErrors, setFormErrors] = useState({});
  const validateForm = (values, password) => {
    const error = {};
    if (values.firstname.length === 0) {
      error.firstname = "First Name must not be empty";
    }
    if (values.lastname.length === 0) {
      error.lastname = "Last Name must not be empty";
    }
    // if (values.email.length === 0) {
    //     error.email = "Email must not be empty";
    // }
    if (password.currentpassword.length !== 0) {
      if (passwordMatches !== true) {
        error.currentpassword = "Incorrect current password";
      }
    }

    if (password.newpassword.length !== 0) {
      if (password.newpassword.length < 6) {
        error.newpassword = "Password must be at least 6 characters";
      } else if (!/^[A-Z]/.test(password.newpassword)) {
        error.newpassword = "Password must start with a capital letter";
      } else if (!/\d/.test(password.newpassword)) {
        error.newpassword = "Password must contain at least one number";
      }
    }
    if (password.confirmpassword !== password.newpassword) {
      error.confirmpassword = "Confirm password and password should be same";
    }
    return error;
  };
  //fin de gestion des errors
  useEffect(() => {
    getUser(userId).then((response) => {
      setData(response);
      console.log(data);
      setValues(response);
      console.log(values);
      setImageSrc(`http://localhost:5000/uploads/user/${response.photo}`);
    });
  }, [userId]);

  console.log("name", values.firstname);
  console.log("lastname", values.lastname);
  console.log("email", values.email);
  console.log("pass", values.password);
  console.log("currpass", password.currentpassword);
  console.log("newpass", password.newpassword);
  console.log("confirm pass", password.confirmpassword);

  //img
  const [imageSrc, setImageSrc] = useState();
  console.log("test", imageSrc);
  const [displayUploadBtn, setDisplayUploadBtn] = useState(false);

  const handleMouseEnter = () => {
    setDisplayUploadBtn(true);
  };

  const handleMouseLeave = () => {
    setDisplayUploadBtn(false);
  };

  //handle de l'image
  const handleFileChange = (e) => {
    const photo = e.target.files[0];
    console.log(photo, 12);
    if (photo) {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("id", userId);
      console.log(formData);
      axios
        .post("http://127.0.0.1:5000/user/addprofilephoto", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          setImageSrc(
            `http://localhost:5000/uploads/user/${response.data.photo}`
          );
          console.log("1", imageSrc);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setImageSrc(`http://localhost:5000/uploads/user/${data.photo}`);
      console.log("2", imageSrc);
    }
  };

  const [isSubmit, setIsSubmit] = useState(false);
  const handleSaveandClose = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(values, password));
    // setIsSubmit(true); si ne travaille pas vérifier ceci
    if (Object.keys(formErrors).length === 0) {
      setOpen(false);
      setIsSubmit(true);
    } else {
      setOpen(true);
    }
  };
  console.log("dialog open ?", open);
  console.log("error form", formErrors);

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    setFormErrors(validateForm(values, password));
  };
  const handleEditPassword = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
    setFormErrors(validateForm(values, password));
  };
  //cryptrage de password
  async function hashPassword(a) {
    const salt = await bcrypt.genSalt(10); // génère un sel de 10 tours
    const hashedPassword = await bcrypt.hash(a, salt); // hache le mot de passe avec le sel
    return hashedPassword;
  }
  const [passwordMatches, setPasswordMatches] = useState(false);
  async function someFunction() {
    const passwordFromUser = password.currentpassword;
    const hashedPassword = await hashPassword(passwordFromUser);
    console.log(hashedPassword);

    // Suppose que `values.password` est une chaîne contenant le mot de passe haché stocké dans votre base de données
    const isMatch = await bcrypt.compare(passwordFromUser, values.password);
    console.log(isMatch);
    // Stocke la valeur de isMatch dans une variable
    setPasswordMatches(isMatch);
    console.log(passwordMatches);
  }
  someFunction();
  //envoi des données form par axios
  console.log("sub ", isSubmit);
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const put = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
      };
      if (password.newpassword.length !== 0) {
        put.password = password.newpassword;
      }
      console.log(put);
      editUser(userId, put, token)
        .then((response) => {
          console.log("profile updated");
          console.log("249", response);
          localStorage.setItem("user", JSON.stringify(response));

          Swal.fire({
            title: "Profile updated successfully",
            icon: "success",
            showCancelButton: false,
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.log("echec update profile");
        });
    }
  }, [formErrors, userId, isSubmit]);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;

  return (
    <Grid container>
      <Grid item direction="row">
        {isAdmin ? (
          <div className="sf-info">
            <div className="userphoto1">
              <img src={imageSrc} alt="picuser" id="photo1" />
            </div>
          </div>
        ) : (
          <div className="sf-info">
            {/* <ImageInput /> */}
            <div className="userphoto1">
              <img src={imageSrc} alt="picuser" id="photo1" />
            </div>
            <div className="follower">
              <div className="num">{followers}</div>
              <div>Followers</div>
            </div>
            <div className="brdr">
              <di>.</di>
              <div>.</div>
            </div>
            <div className="follow">
              <div className="num">{following}</div>
              <div>Following</div>
            </div>
          </div>
        )}

        <br></br>
        <div style={{ marginLeft: "5vw", width: "45vw", marginTop: "5vh" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "3vh",
              fontFamily: "serif",
            }}
          >
            <h2 style={{ color: "#343beb", marginRight: "3vw" }}>
              First Name{" "}
            </h2>
            <h2>{data.firstname}</h2>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "3vh",
              fontFamily: "serif",
            }}
          >
            <h2 style={{ color: "#343beb", marginRight: "3vw" }}>Last Name </h2>
            <h2>{data.lastname}</h2>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "3vh",
              fontFamily: "serif",
            }}
          >
            <h2 style={{ color: "#343beb", marginRight: "3vw" }}>Email</h2>
            <h2>{data.email}</h2>
          </div>
          <br />

          {values && password && (
            <div>
              <Button
                variant="outlined"
                onClick={handleClickOpen("paper")}
                style={{
                  backgroundColor: "#343beb",
                  borderRadius: "5px",
                  letterSpacing: "1px",
                  position: "absolute",
                  top: "20%",
                  left: "80%",
                  width: "auto",
                  color: "white",
                }}
              >
                <FaPencilAlt
                  style={{ marginLeft: "-5px", marginRight: "5px" }}
                />
                Edit Profile
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent>
                  <br /> <br />
                  <br />
                  <br />
          
                  <div className="profile-pic-div">
                    <img src={imageSrc} alt="Profile" id="photo" />
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="file"
                      id="btnchoose"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        display: displayUploadBtn ? "block" : "none",
                        cursor: "pointer",
                      }}
                    >
                      <FaPencilAlt /> Edit photo
                    </label>
                  </div>
                  <label htmlFor="name" style={{ color: "#fff" }}>
                    First Name
                  </label>
                  <InputText
                    id="firstname"
                    name="firstname"
                    value={values.firstname}
                    onChange={handleEdit}
                    style={{ border: "1px solid #343beb" }}
                  />
                  {/* //herree */}
                  {formErrors.firstname && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "2.5vh",
                        marginTop: "0.5vh",
                        marginLeft: "-1vw",
                      }}
                    >
                      {formErrors.firstname}
                    </p>
                  )}
                  <label htmlFor="lastname" style={{ color: "#fff" }}>
                    Last Name
                  </label>
                  <InputText
                    id="lastname"
                    name="lastname"
                    value={values.lastname}
                    onChange={handleEdit}
                    style={{ border: "1px solid #343beb" }}
                  />
                  {formErrors.lastname && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "2.5vh",
                        marginTop: "0.5vh",
                        marginLeft: "-1vw",
                      }}
                    >
                      {formErrors.lastname}
                    </p>
                  )}
                  <label htmlFor="email" style={{ color: "#fff" }}>
                    Email
                  </label>
                  <InputText
                    id="email"
                    name="email"
                    value={values.email}
                    style={{ border: "1px solid #343beb" }}
                  />
                  {/* {formErrors.email && (
                                                <p style={{ color: 'red', fontSize: '2.5vh', marginTop: "0.5vh", marginLeft: "-1vw" }}>{formErrors.email}</p>
                                            )} */}
                  <label htmlFor="currentpassword" style={{ color: "#fff" }}>
                    Current Password
                  </label>
                  <InputText
                    id="currentpassword"
                    name="currentpassword"
                    onChange={handleEditPassword}
                    style={{ border: "1px solid #343beb" }}
                  />
                  {formErrors.currentpassword && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "2.5vh",
                        marginTop: "0.5vh",
                        marginLeft: "-1vw",
                      }}
                    >
                      {formErrors.currentpassword}
                    </p>
                  )}
                  <label htmlFor="newpassword" style={{ color: "#fff" }}>
                    New Password
                  </label>
                  <InputText
                    id="newpassword"
                    name="newpassword"
                    onChange={handleEditPassword}
                    style={{ border: "1px solid #343beb" }}
                  />
                  {formErrors.newpassword && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "2.5vh",
                        marginTop: "0.5vh",
                        marginLeft: "-1vw",
                      }}
                    >
                      {formErrors.newpassword}
                    </p>
                  )}
                  <label htmlFor="confirmpassword" style={{ color: "#fff" }}>
                    Confirm New Password
                  </label>
                  <InputText
                    id="confirmpassword"
                    name="confirmpassword"
                    onChange={handleEditPassword}
                    style={{ border: "1px solid #343beb" }}
                  />
                  {formErrors.confirmpassword && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "2.5vh",
                        marginTop: "0.5vh",
                        marginLeft: "-1vw",
                      }}
                    >
                      {formErrors.confirmpassword}
                    </p>
                  )}
                </DialogContent>

                <DialogActions>
                  <Button
                    onClick={handleSaveandClose}
                    style={{ color: "white", backgroundColor: "#343beb" }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleClose}
                    style={{ color: "black", backgroundColor: "white" }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
export default withScrollToTop(Profilee);
