const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
//pmjpmxuwqwnbfqsa
module.exports.forgot_post = async (req, res) => {
  const { email } = req.body;
  try {
    //chercher dans la base de données est ce que l'email existe ou pas
    if (email) {
      const isUser = await User.findOne({ email: email })
      //il existe deja
      if (isUser) {
        //creation du token
        const secretKey = isUser._id + 'net ninja secret ';
        const token = jwt.sign({ userID: isUser._id }, secretKey, { expiresIn: "500m" });
        const link = `http://localhost:3000/user/reset-password/${isUser._id}/${token}`;
        const transport = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            user:"eastremtesting17@gmail.com",//"estreamplateform@gmail.com",//
            pass: "dnozzgkbvcvgirjr"///"lupnouesznbbwpus"
            //user: process.env.EMAIL,
            //pass: process.env.EMAIL_PASSWORD,
            //pass: "pmjpmxuwqwnbfqsa"
            // last one new     cigsrttiyzajtzqz with estreamtest
          },
        })
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: `Password Reset Request`,
          text: `
<!doctype html>
<html lang="en-US">
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email ">
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
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href=${link}
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
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
</html>`,
          html: `
<!doctype html>
<html lang="en-US">
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email ">
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
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${link}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
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
</html>`,
        };
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(400).json({ message: "Error" });
          }
          return res.status(200).json({ message: "Email Sent" });
        });
      }else{res.status(400).json({ message: "user is not signed up before" });}
    } else {
      return res.status(400).json({ message: "email is required" });
    }
  } catch {
    return res.status(400).json({ message: error.message });
  }
}
module.exports.reset_post = async (req, res) => {
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const id = req.params.id;
  const token = req.params.token;
  console.log(token);
  const isUser = await User.findById(id);
  const secretKey = isUser._id + 'net ninja secret ';
  try {
    if (newPassword && confirmPassword && id && token) {
      if (newPassword == confirmPassword) {
        // token verifiying
        const isValid = await jwt.verify(token, secretKey)
        if (isValid) {
          // crypter mot de passe 
          const genSalt = await bcrypt.genSalt(10);
          const hashedPass = await bcrypt.hash(newPassword, genSalt);
          const isSuccess = await User.findByIdAndUpdate(isUser._id, {
            $set: {
              password: hashedPass
            }
          });
          if (isSuccess) {
            return res.status(200).json({ message: "password reset has successed" });
          }
        } else {
          return res.status(400).json({ message: "Link expired" });
        }
      } else {
        return res.status(400).json({ "message": "Password and confirm password does not match" });
      }
    } else {
      return res.status(400).json({ "message": "All fields are required" });
    }
  } catch (error) {
    return res.status(400).json({ "message": error.message });
  }
}
module.exports.forgot_get = (req, res) => {
  //retourner la page de saisie d'email
  console.log('retourner la page de saisie demail')
}
module.exports.reset_get = (req, res) => {
  //retourner la page de saisie de password
  console.log('retourner la page de saisie de password')
}




























