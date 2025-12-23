const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { create } = require('../models/user');
const nodemailer = require('nodemailer');
const { currentUser } = require('../middleware/currentUser');
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };
  //incorrect email
  if (err.message == 'incorrect email') {
    errors.email = 'email not registred';
  }
  //email not verified
  if (err.message == 'unverified email') {
    errors.email = 'email not verified';
  }
  //email blocked
  if (err.message == 'blocked email') {
    errors.email = 'email blocked';
  }
  //incorrect password
  if (err.message == 'incorrect password') {
    errors.password = 'incorrect password';
  }
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'You are already registred login to your account';
    return (errors);
  }
  // validation errors
  if (err.message.includes('user validation failed')) {

    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return (errors);
}

// controller actions
module.exports.signup_get = (req, res) => {

}
module.exports.login_get = (req, res) => {
}
module.exports.signupconfirm_post = async (req, res) => {
  const id = req.params.id;
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
module.exports.signupconfirm_get = async (req, res) => {

}

module.exports.signup_post = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      typeof firstname !== "string" ||
      typeof lastname !== "string" ||
      typeof password !== "string" ||
      !validator.isEmail(email)
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false
    });

    const link = `${process.env.CLIENT_URL}/user/signupconfirm/${user._id}`;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sign Up Confirmation",
      html: `
        <h2>Email confirmation</h2>
        <p>Welcome to Estream platform.</p>
        <p>Please confirm your email by clicking the button below:</p>
        <a href="${link}" style="padding:10px 20px;background:#20e277;color:#fff;border-radius:5px;text-decoration:none;">
          Confirm your email
        </a>
      `
    };

    await transport.sendMail(mailOptions);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: maxAge * 1000
    });

    return res.status(201).json({ message: "Signup successful. Check your email." });

  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
};

//create token
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  };
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    const idcurrent = currentUser(token);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user, token });
    console.log(token);
    console.log(idcurrent);
    res.locals.currentUser = idcurrent;
    console.log(res.locals.currentUser);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/pageacceuil');
}
