const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

//pmjpmxuwqwnbfqsa
module.exports.forgot_post = async (req, res) => {
  try {
    // Sécuriser l'email en le convertissant en string
    const email = req.body.email ? req.body.email.toString().trim() : null;

    // Validation de l'email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validation basique du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Chercher dans la base de données si l'email existe
    const isUser = await User.findOne({ email: email });

    // Vérifier si l'utilisateur existe
    if (!isUser) {
      return res.status(400).json({ message: "User is not signed up before" });
    }

    // Création du token
    const secretKey = isUser._id.toString() + 'net ninja secret ';
    const token = jwt.sign({ userID: isUser._id.toString() }, secretKey, { expiresIn: "500m" });

    // Sécuriser l'ID pour l'URL
    const userId = isUser._id.toString();
    const link = `http://localhost:3000/user/reset-password/${userId}/${token}`;

    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "eastremtesting17@gmail.com",
        pass: "dnozzgkbvcvgirjr"
      },
    });

    const mailOptions = {
      from: process.env.EMAIL || "eastremtesting17@gmail.com",
      to: email,
      subject: `Password Reset Request`,
      text: `Reset your password using this link: ${link}`,
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
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(400).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email Sent" });
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(400).json({ message: "An error occurred" });
  }
};

module.exports.reset_post = async (req, res) => {
  try {
    // Sécuriser toutes les entrées
    const newPassword = req.body.newPassword ? req.body.newPassword.toString() : null;
    const confirmPassword = req.body.confirmPassword ? req.body.confirmPassword.toString() : null;

    // Sécuriser et valider l'ID
    const id = req.params.id ? req.params.id.toString() : null;
    const token = req.params.token ? req.params.token.toString() : null;

    console.log("Token received:", token ? "Present" : "Missing");

    // Validation des champs requis
    if (!newPassword || !confirmPassword || !id || !token) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Validation des mots de passe
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    // Validation de la longueur du mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userObjectId = new mongoose.Types.ObjectId(id);
    const isUser = await User.findById(userObjectId);

    if (!isUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const secretKey = isUser._id.toString() + 'net ninja secret ';

    // Vérifier le token
    let isValid;
    try {
      isValid = jwt.verify(token, secretKey);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(400).json({ message: "Link expired" });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(400).json({ message: "Invalid token" });
      }
      throw jwtError;
    }

    if (!isValid) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Crypter le mot de passe
    const genSalt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, genSalt);

    // Mettre à jour l'utilisateur avec l'ObjectId sécurisé
    const isSuccess = await User.findByIdAndUpdate(
      userObjectId,
      { $set: { password: hashedPass } },
      { new: true }
    );

    if (isSuccess) {
      return res.status(200).json({ message: "Password reset successful" });
    } else {
      return res.status(400).json({ message: "Failed to update password" });
    }

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(400).json({ message: "An error occurred during password reset" });
  }
};

module.exports.forgot_get = (req, res) => {
  // Retourner la page de saisie d'email
  console.log('Return email input page');
  res.status(200).json({ message: "Forgot password page" });
};

module.exports.reset_get = (req, res) => {
  try {
    // Sécuriser les paramètres
    const id = req.params.id ? req.params.id.toString() : null;
    const token = req.params.token ? req.params.token.toString() : null;

    if (!id || !token) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    // Retourner la page de saisie de password
    console.log('Return password input page');
    res.status(200).json({
      message: "Reset password page",
      userId: id,
      token: token.substring(0, 10) + "..." // Ne pas renvoyer le token complet
    });
  } catch (error) {
    console.error("Reset get error:", error);
    res.status(500).json({ message: "Server error" });
  }
};