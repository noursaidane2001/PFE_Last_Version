const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt');
router.use(bodyParser.json());
const authController =require('../controllers/authController');
const passwordController =require('../controllers/passwordController');
const userController =require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');
const multer = require('multer');
const nodemailer = require('nodemailer');
//Manage User
router.delete('/deleteuser',userController.deleteuser);
router.delete('/:id',userController.deleteuserbyid);
router.get('/:id',userController.userbyid);
router.get('/',userController.getallusers);
router.put('/blockuser/:id',userController.blockuserbyid);
router.put('/deblockuser/:id',userController.deblockuserbyid);
router.put('/:id',userController.edituserbyid);
//PASWORD RESET Routes
router.post('/forgot-password',passwordController.forgot_post);
router.get('/forgot-password',passwordController.forgot_get);
router.post('/reset-password/:id/:token',passwordController.reset_post);
router.get('/reset-password/:id/:token',passwordController.reset_get);
//AUTH Routes
router.get('/sign',authController.signup_get);
router.post('/sign',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/logout',authController.logout_get);
router.post('/signupconfirm/:id',authController.signupconfirm_post);
router.get('/signupconfirm/:id',authController.signupconfirm_get);

//User Controller follow and followers
 router.patch('/follow/:id', userController.follow);
 router.patch('/unfollow/:id', userController.unfollow);
 router.get('/following/:id', userController.following);
 router.get('/followers/:id', userController.followers);
 router.get('/mytournaments/:id', userController.tournaments_participated);
// Add photo de profile
const filename = '';

const mystorage = multer.diskStorage({
  destination: './uploads/user', //'./uploads/user'
  filename: (req, file, callback) => {
    // generate a unique filename based on the current time
    let date = Date.now();
    let f1 = date + '.' + file.mimetype.split('/')[1];
    filename = f1;
    callback(null, f1);
  }
});

const upload = multer({storage: mystorage});

router.post('/addprofilephoto', upload.single('photo'), async (req, res) => {
  try {
    const id = req.body.id;
    let filename = req.file ? req.file.filename : 'defaultUser.png'; //  nom de fichier par défaut 
    const updatedUser = await User.findByIdAndUpdate(id, {photo: filename}, {new: true});
    res.status(201).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json({error: err.message});
  }
});

module.exports = router;




