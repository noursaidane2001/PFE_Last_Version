const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { create } = require('../models/user');
const nodemailer = require('nodemailer');
const { currentUser } = require('../middleware/currentUser');
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: ''};
  //incorrect email
if(err.message == 'incorrect email'){
  errors.email = 'email not registred';
}
  //email not verified
  if(err.message == 'unverified email'){
    errors.email = 'email not verified';
  }
    //email blocked
if(err.message == 'blocked email'){
  errors.email = 'email blocked';
}
  //incorrect password
if(err.message == 'incorrect password'){
  errors.password = 'incorrect password';
}
  // duplicate email error
if (err.code === 11000) {
  errors.email = 'You are already registred login to your account';
  return (errors);
  }
    // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return (errors);
}

// controller actions
module.exports.signup_get = (req, res) => {
 //res.render('signup');
 //retourner la page de signup
// res.status(201).json({name: user.name, lastname: user.lastname});
}
module.exports.login_get = (req, res) => {
  //res.render('login');
  //retourner la page de login
}
module.exports.signupconfirm_post = async(req, res) => {
  const id = req.params.id;
  // const token = req.params.token;
  const isUser = await User.findById(id);
  try {
        if (isUser) {
          const isSuccess = await User.findByIdAndUpdate(isUser._id, {
            $set: {
              verified: true
            }
          });
          if (isSuccess) {
            return res.status(200).json({ message: "User's email is verified with success" });
          }
        }
        else {
          return res.status(400).json({ message: "Already Confirmed" });
  }
}
  catch (error) {
    return res.status(400).json({ "message": error.message });
  }
}
module.exports.signupconfirm_get= async(req, res) => {
 
}


module.exports.signup_post = async (req, res) => {
  const {firstname , lastname , email , password } = req.body;
  try {
    const user = await User.create({ firstname , lastname ,email , password });
    const secretKey = user._id + 'net ninja secret ';
    // const tokensign = jwt.sign({ userID: user._id }, secretKey, { expiresIn: "500m" });
    const link = `http://localhost:3000/user/signupconfirm/${user._id}`;

    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user:"eastremtesting17@gmail.com",
        pass: "dnozzgkbvcvgirjr"
      },
    })
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Sign Up Confirmation `,
      text: `
      <!doctype html>
      <html lang="en-US">
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
         
          <meta name="description" content="Confirm Email ">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                              You joined Estream Plateform This is email confirmation
                                              </h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                 We are so glad that you became a member with us but to finish your sign up procedure you should confirm your email adress by following the next link 
                                                 Welcome to our plateform Estream
                                              </p>
                                              <a href=${link}
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                  Confirm your email
                                                  </a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                         
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
      </body>
      </html>`, html: `  <!doctype html>
      <html lang="en-US">
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
         
          <meta name="description" content="Confirm Email ">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;"> You joined Estream Plateform This is email confirmation</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                 We are so glad that you became a member with us but to finish your sign up procedure you should confirm your email adress by following the next link 
                                                 Welcome to our plateform Estream
                                              </p>
                                              <a href=${link}
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                  Confirm your email
                                                  </a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                         
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
      </body>
      </html> `
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({ message: "Error" });
      }
      return res.status(200).json({ message: "Email Sent" });
    });
    //, user.isAdmin
    const token = createToken(user._id );
    res.cookie('jwt', token , { httpOnly : true , maxAge : maxAge * 1000});
    res.status(201).json({user: user._id});
  }
  catch(err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
}
//create token
const maxAge = 3 * 24 * 60 * 60 ;
//, isAdmin
const createToken = (id ) =>{
  // , isAdmin
    return jwt.sign({ id } , 'net ninja secret ', {
      expiresIn: maxAge
    });
}
module.exports.login_post = async (req, res) => {
  /*const { email, password } = req.body;
  console.log(email, password);1
  res.send('user login');*/
  const { email, password } = req.body;
  try{
     const user =await User.login(email , password);
     const token = createToken(user._id);
    const idcurrent = currentUser(token);
     res.cookie('jwt', token , { httpOnly : true , maxAge : maxAge * 1000});
     res.status(200).json({user , token});
     console.log(token);
     console.log(idcurrent);
     res.locals.currentUser = idcurrent;
     console.log(res.locals.currentUser);
  }catch(err){
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}
module.exports.logout_get = (req, res) => {
  res.cookie('jwt' , '',{maxAge : 1});
  res.redirect('/pageacceuil');
}
