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
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const mystorage = multer.diskStorage({
  destination: './uploads/user', // dossier fixe
  filename: (req, file, callback) => {
    // Générer un nom de fichier unique et sûr
    const uniqueName = uuidv4();

    // Extensions autorisées selon MIME type
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
    };

    const ext = mimeToExt[file.mimetype] || 'bin'; // fallback sécurisé

    const safeFilename = `${uniqueName}.${ext}`;
    callback(null, safeFilename);
  },
});

const upload = multer({ storage: mystorage });

router.post('/addprofilephoto', upload.single('photo'), async (req, res) => {
  try {
    const id = req.body.id;
    const filename = req.file ? req.file.filename : 'defaultUser.png'; // fichier par défaut
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { photo: filename },
      { new: true }
    );
    res.status(201).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;




//CRUD user: Modifier ses infos
//  router.put('/:id', async (req, res) => {
//    try {
//      id = req.params.id;
//      newData = req.body;
//      updated = await User.findByIdAndUpdate({ _id : id }, newData);
//    await  updated.save();
//     res.status(200).send(updated);
//   } catch (err) {
//      res.status(400).send(err);
//    }
//  });

// const upload = multer({storage: mystorage});

// router.post('/addprofilephoto', upload.single('photo'), async (req, res) => {
//   try {
//     const id = req.body.id;
//     const updatedUser = await User.findByIdAndUpdate(id, {photo: filename}, {new: true});
//     filename = '';
//     res.status(201).json(updatedUser);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({error: err.message});
//   }
// });


// module.exports= router; 
