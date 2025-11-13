const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Tournament = require('../models/tournament');
// const fs = require('fs');
// const path = require('path');
// const defaultPhoto = Buffer.from(fs.readFileSync(path.join(__dirname, '..', 'photos', 'defaultprofile.jpg')));
const userSchema = new mongoose.Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'mention your email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'invalid email']
  },
  password: {
    type: String,
    required: [true, 'mention your password'],
    minlength: [6, 'password length required is 6']
  },
  isAdmin: {
    type: Boolean,
    default: false // par défaut, un utilisateur n'est pas un administrateur
  },
  photo: {
    type: String,
    default: 'defaultprofile.jpg'
  },
  blocked: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'

  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // tournamentsparticipations:{
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "Tournament",
  //   // unique :true
  //   unique :true

  // }
});
// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
  console.log('new user was created & saved', doc);
  next();
});
// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
  //console.log('user about to be created & saved', this);
  //ajouter l'email verification ici
  next();
});
//static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  {
    if (user) {
      if (user.verified == true && user.blocked == false) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
          return user;
        } throw Error('incorrect password');
      } else {
        if (user.verified == false) { throw Error("unverified email"); }
        if (user.blocked == true) { throw Error("blocked email"); }
      }
    } else {
      throw Error('incorrect email');
    };
  }
};
//find user par id
// userSchema.statics.profile = async function(_id){
//   const user = await this.find({_id });

// };

const User = mongoose.model('User', userSchema);

module.exports = User;